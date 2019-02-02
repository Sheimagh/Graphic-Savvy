//HTML established to run JS

    // Hide content, will be recalled on button click..
    $(document).ready(function(event){
        $("#content").hide();
    })
    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC0-7aCKf87MoX2wg5NqmkUAqN6VKnEnpo",
    authDomain: "graphic-savvy.firebaseapp.com",
    databaseURL: "https://graphic-savvy.firebaseio.com",
    projectId: "graphic-savvy",
    storageBucket: "graphic-savvy.appspot.com",
    messagingSenderId: "906221140528"
  };

  //Initializing Firebase and storing current user session data, recognizing when logged on and not logged on
  firebase.initializeApp(config);
  var firebase = firebase.database();
  var connectionsRef = firebase.ref("/connections");
  var connectedRef = firebase.ref(".info/connected");
  connectedRef.on("value", function(snap){
      if(snap.val()){
          var con = connectionsRef.push(true);
          con.onDisconnect().remove();
      }
  })

 
  

     //Submit button onclick to pull top search results for the desired location so the user is able to select the exact location
    $("#submit").on("click", function (event) {
        event.preventDefault();
        
        $("#text-content").empty();
        var input = document.getElementById("userInput").value;

        $(".searchButtons").hide();
    
        // encode URI (i) allows for the input, if location name more than one word to be parsed within the api database, in this case %20 in the free spaces
        var apiKey = "ESTEVANCRUZ";
        var apiUrl = "https://www.budgetyourtrip.com/api/v3/search/locationdata/" + encodeURIComponent(input);

        console.log(apiUrl)

        //Ajax call to return API data
        $.ajax({
            type: "GET",
            url: `https://thawing-woodland-40734.herokuapp.com/?apikey=${apiKey}&link=${apiUrl}`
        }).then(function (response) {
            console.log(response);

            //Storing response data into one variable to access later
            var results = response.data;
            console.log(results)
            
            //For loop to loop through all of the return location data
            for (var i = 0; i < 5; i++) {
                //declaring variable to hold each search results geonameid
                var captureIds = results[i].geonameid;
                ////declaring variable to hold each search results city name
                var captureCity = results[i].asciiname;
                //declaring variable to hold each search results country code
                var captureCountry = results[i].country_code;
                //declaring variable to hold each search results state code or number if applicable 
                var captureState = results[i].admin1_code;
                ////declaring variable to contain city name, state and country
                var capturePush = captureCity + ", " + captureState + ", " + captureCountry;
                //creating empty div to hold the buttons
                var searchResultsDiv = $("<div class='container' id='parentDiv'>");
                //creating buttons for each search result
                var searchResultsBtn = $("<br><button class='button btn-sm btn-primary searchButtons' type='button' id='btnz' value=" + captureIds + ">").text(capturePush);
                //organizing placement into html
                

                console.log(capturePush)
                //pushing the buttons into html
                $("#searchBar").append(searchResultsDiv);
                searchResultsDiv.append(searchResultsBtn);
            }
        })
    })  //POPULATING CITY NAME AND TOTAL AVG TRAVEL COST
        //Using document call to recognize click on dynamically created search results butttons
        $(document).on("click", ".searchButtons", function(event){
            event.preventDefault();
            //Removes all previous API data
            clean();
            $("#content").show();
            //capturing each search result buttons value into var selectionId to insert into new API call
        var selectionId = $(this).val();
        console.log("This is the selection Id: " + selectionId)
            //calling API for the secons time with avg cost endpoint URL
        var apiKey = "ESTEVANCRUZ";
        var apiUrl = "https://www.budgetyourtrip.com/api/v3/costs/locationinfo/" + selectionId;
        
        $.ajax({
            type: "GET",
            url: `https://thawing-woodland-40734.herokuapp.com/?apikey=${apiKey}&link=${apiUrl}`
        }).then(function (costResponse) {
            var costResults = costResponse.data;
            var currencyCode = costResponse.data.info.currency_code;
            var currencySymb = costResponse.data.info.symbol;
            console.log(currencyCode)
            console.log(currencySymb)
            console.log(costResults)
            var cityName = costResponse.data.info.asciiname;
            console.log(cityName)
            var avgBudgtCost = costResponse.data.costs[0].value_budget;
            var avgMidCost = costResponse.data.costs[0].value_midrange;
            var avgLuxCost = costResponse.data.costs[0].value_luxury;
            //Rounding the cost reaults for better UI experience
            avgBudgtCost = Math.round(avgBudgtCost);
            avgMidCost = Math.round(avgMidCost);
            avgLuxCost = Math.round(avgLuxCost);
            console.log(avgBudgtCost)
            console.log(avgMidCost)
            console.log(avgLuxCost)
            $(".city").text(cityName);
            var travelStyle = $(".select").val();
            console.log(travelStyle)
            if (travelStyle === "Budget"){
                $("#avgCostDisplayTxt").text(" "+currencySymb + avgBudgtCost);
                $("#avgCostDisplay").text("Per person per day");
            }
            // DYNAMICALLY CHANGES TRAVEL STYLE BUDGET FROM CLICK DOWN 
            $(".select").change(function(usd){
                    travelStyle = $(this).val();
                    if (travelStyle === "Midrange"){
                    $("#avgCostDisplayTxt").text(" " + currencySymb + avgMidCost);
                    $("#avgCostDisplay").text("Per person per day");
                }   else if (travelStyle === "Luxury") {
                    $("#avgCostDisplayTxt").text(" " + currencySymb + avgLuxCost);
                    $("#avgCostDisplay").text("Per person per day");
                }  
                else {
                    $("#avgCostDisplayTxt").text(" " + currencySymb + avgBudgtCost);
                    $("#avgCostDisplay").text("Per person per day");
                }
            })
            //Coverts AVG Price to EUR
            var currencyConversionUrl = "https://www.budgetyourtrip.com/api/v3/currencies/convert/usd/eur/1";

            $.ajax({
            type: "GET",
            url: `https://thawing-woodland-40734.herokuapp.com/?apikey=${apiKey}&link=${currencyConversionUrl}`
            }).then(function (currencyResponse){
            console.log(currencyResponse);
            travelStyle = $(".select").val();
            var conversionRate = currencyResponse.data.newAmount;
            var eurSymbol = "€";
            var budgtConversion = (avgBudgtCost * conversionRate);
            budgtConversion = Math.round(budgtConversion)
            var midConversion = avgMidCost * conversionRate;
            midConversion = Math.round(midConversion)
            var luxConversion = avgLuxCost * conversionRate;
            luxConversion = Math.round(luxConversion);
               console.log(budgtConversion)
               

            $(".currency").change(function(){
                currency = $(this).val();
                if (currency === "EUR" | travelStyle === "Budget") {
                    $("#avgCostDisplayTxt").text(eurSymbol + budgtConversion);
                } else if (currency === "EUR" | travelStyle === "Midrange"){
                    $("#avgCostDisplayTxt").text(eurSymbol + midConversion);
                } else if (currency === "EUR" | travelStyle === "Luxury"){
                    $("#avgCostDisplayTxt").text(eurSymbol + luxConversion);
                }else{
                    usd();
                }
            
            })
           
            })

            //Convert currency back to USD --- not working currently
            var currencyConversionUrl = "https://www.budgetyourtrip.com/api/v3/currencies/convert/eur/usd/1";

            $.ajax({
            type: "GET",
            url: `https://thawing-woodland-40734.herokuapp.com/?apikey=${apiKey}&link=${currencyConversionUrl}`
            }).then(function (currencyResponseTwo){
            console.log(currencyResponseTwo);
            travelStyle = $(".select").val();
            var conversionRate = currencyResponseTwo.data.newAmount;
            var budgtConversionUsd = (budgtConversion * conversionRate);
            budgtConversion = Math.round(budgtConversionUsd)
            var midConversionUsd = midConversion * conversionRate;
            midConversionUsd = Math.round(midConversionUsd)
            var luxConversionUsd = luxConversion * conversionRate;
            luxConversionUsd = Math.round(luxConversionUsd)
            $(".currency").change(function(){
                    // var currency = $(this).val();
                if (currency === "USD" | travelStyle === "Budget") {
                    $("#avgCostDisplayTxt").text(currencySymb + budgtConversionUsd);
                } else if (currency === "USD" | travelStyle === "Midrange"){
                    $("#avgCostDisplayTxt").text(currencySymb + midConversionUsd);
                } else if (currency === "USD" | travelStyle === "Luxury"){
                    $("#avgCostDisplayTxt").text(currencySymb + luxConversionUsd);
                }
            
            })
           
            })
        //===================================================================================================================
                  // Weather --------------------------------------------------------------------
          // url with API key to retreive forecast, city as variable and units fixed as imperial
          var weather = "https://api.openweathermap.org/data/2.5/forecast?id="+selectionId+"&units=imperial&APPID=2c5299d78f7bf581a1a4bccad14eaddf";
          
          // universal array to alocate today and next days of the week
          var week = [moment().format('ll'),moment().add(1, 'days').format('ll'),moment().add(2, 'days').format('ll'),moment().add(3, 'days').format('ll'),moment().add(4, 'days').format('ll')];
          // Ajax call for weather API
          $.ajax({
              url: weather,
              method: "GET"
          }).then(function(response){
              // forecast for next five days as object, predictions are every three hours
              console.log(response);
            // print forecast as table for today and next four days as table, using prediction for each 24 hours
            // print forecast image using same images from font
            $("#weather").append("<table style='padding: 20px ; width:1000px'><tr><td style='padding: 20px'>"+week[0]+"<p> Temp(F): "+response.list[0].main.temp+"<br>Weather: "+response.list[0].weather[0].main+
            "</p><br><img src='http://openweathermap.org/img/w/"+response.list[0].weather[0].icon+".png'></td><td style='padding: 20px'>"+week[1]+"<p> Temp(F): "+response.list[8].main.temp+"<br>Weather: "+
            response.list[8].weather[0].main+"</p><br><img src='http://openweathermap.org/img/w/"+response.list[8].weather[0].icon+".png'></td><td style='padding: 20px'>"+week[2]+"<p> Temp(F): "+response.list[16].main.temp
            +"<br>Weather: "+response.list[16].weather[0].main+"</p><br><img src='http://openweathermap.org/img/w/"+response.list[16].weather[0].icon+".png'></td><td style='padding: 20px'>"+week[3]+"<p> Temp(F): "+
            response.list[24].main.temp+"<br>Weather: "+response.list[24].weather[0].main+"</p><br><img src='http://openweathermap.org/img/w/"+response.list[24].weather[0].icon+".png'></td><td style='padding: 20px'>"+week[4]+"<p> Temp(F): "+
            response.list[32].main.temp+"<br>Weather: "+response.list[32].weather[0].main+"</p><br><img src='http://openweathermap.org/img/w/"+response.list[32].weather[0].icon+".png' style='size: 100%'></td></tr></table>");
      })
            //=========================================================================================================
        
        // API FOR LOCAL TRANSPORTATION AND SIGHTSEEING - NO ADJUSTMENT BASED ON TRAVEL STYLE
        $("#dataDiv").empty();
        var dataDiv = $("<div id='dataDiv'>");
        var highlightsURL = "https://www.budgetyourtrip.com/api/v3/costs/highlights/" + selectionId;
        //third api call for transportation and sightseeing costs, "highlights" endpoint
        $.ajax({
            type: "GET",
            url: `https://thawing-woodland-40734.herokuapp.com/?apikey=${apiKey}&link=${highlightsURL}`
        }).then(function (highlightsResponse) {
            var highlightsData = highlightsResponse.data;
            console.log(highlightsData)
            // Pulls all data for ACCOMODATION and appens into HTML
            for (var j = 0; j < highlightsData.length; j++){
                console.log(highlightsData[j].category_id)
                if (highlightsData[j].category_id === "1"){
                    var accomDes = highlightsData[j].description;
                    var accomCost = highlightsData[j].cost;
                    accomCost = Math.round(accomCost);
                    var accomTxt = " $" + accomCost + " " + accomDes;
                    $("#accom").append(accomTxt);
                    $(dataDiv).prepend(accomTxt);
                } else if (highlightsData[j].category_id === "3"){
                    var transportDes = highlightsData[j].description;
                    var transportCost = highlightsData[j].cost;
                    transportCost = Math.round(transportCost);
                    var transportTxt = " $" + transportCost + " " + transportDes;
                    $("#transportTxt").append(transportTxt);
                } else if (highlightsData[j].category_id === "4"){
                    var foodDes = highlightsData[j].description;
                    var foodCost = highlightsData[j].cost;
                    foodCost = Math.round(foodCost);
                    var foodTxt = " $" + foodCost + " " + foodDes;
                    $("#foodTxt").append(foodTxt);
                }  else if (highlightsData[j].category_id === "6"){
                    var entertainDes = highlightsData[j].description;
                    console.log("This is the description: " + entertainDes)
                    var entertainCost = highlightsData[j].cost;
                    entertainCost = Math.round(entertainCost);
                    var entertainTxt = " $" + entertainCost + " " + entertainDes;
                    console.log(entertainTxt)
                    $("#entertainTxt").append(entertainTxt);
                }  else if (highlightsData[j].category_id === "5"){
                    var waterDes = highlightsData[j].description;
                    console.log("This is the description: " + waterDes)
                    var waterCost = highlightsData[j].cost;
                    waterCost = Math.round(waterCost);
                    var waterTxt = " $" + waterCost + " " + waterDes;
                    console.log(waterTxt)
                    $("#alcoholTxt").append(waterTxt);
                }  else if (highlightsData[j].category_id === "15"){
                    var attractionDes = highlightsData[j].description;
                    console.log("This is the attraction description: " + attractionDes)
                    var attractionCost = highlightsData[j].cost;
                    attractionCost = Math.round(attractionCost);
                    var attractionTxt = " $" + attractionCost + " " + attractionDes;
                    console.log(attractionTxt)
                    $("#attractionTxt").append(attractionTxt);
                }  
            }
        })
        
})
function clean() {
    $("#accom").empty();
    $("#transportTxt").empty();
    $("#foodTxt").empty();
    $("#entertainTxt").empty();
    $("#alcoholTxt").empty();
    $("#attractionTxt").empty();
    // $("#parentDiv").empty();
    $("table").empty();
}
        
})
