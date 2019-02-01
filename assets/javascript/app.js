//HTML established to run JS
// $(document).ready(function () {
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
        var input = document.getElementById("userInput").value;
        alert(input);

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
                var searchResultsDiv = $("<div id='parentDiv'>");
                //creating buttons for each search result
                var searchResultsBtn = $("<button class='button btn-sm btn-primary searchButtons' type='button' id='btnz' value=" + captureIds + ">").text(capturePush);
                //organizing placement into html
                searchResultsDiv.append(searchResultsBtn);

                console.log(capturePush)
                //pushing the buttons into html
                $("#searchBar").append(searchResultsBtn);
            }
        })
    })  //POPULATING CITY NAME AND TOTAL AVG TRAVEL COST
        //Using document call to recognize click on dynamically created search results butttons
        $(document).on("click", ".searchButtons", function(event){
            event.preventDefault();
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
            $("#city").text(cityName);
            var travelStyle = $("#travelStyle").val();
            console.log(travelStyle)

            ///Add to a .on("value") when travel style is adjusted
            if (travelStyle === "Budget"){
                $("#avgCostDisplayTxt").text(" $" + avgBudgtCost);
                $("#avgCostDisplay").text("Per person per day");
            }else if (travelStyle === "Midrange"){
                $("#avgCostDisplayTxt").text(" $" + avgMidCost);
                $("#avgCostDisplay").text("Per person per day");
            } else {
                $("#avgCostDisplayTxt").text(" $" + avgLuxCost);
                $("#avgCostDisplay").text("Per person per day");
            }
        }) 
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
                }  else if (highlightsData[j].category_id === "12"){
                    var alcoholDes = highlightsData[j].description;
                    console.log("This is the description: " + alcoholDes)
                    var alcoholCost = highlightsData[j].cost;
                    alcoholCost = Math.round(alcoholCost);
                    var alcoholTxt = " $" + alcoholCost + " " + alcoholDes;
                    console.log(alcoholTxt)
                    $("#alcoholTxt").append(alcoholTxt);
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
        var accomodationURL = "https://www.budgetyourtrip.com/api/v3/categories/";

        $.ajax({
            type: "GET",
            url: `https://thawing-woodland-40734.herokuapp.com/?apikey=${apiKey}&link=${accomodationURL}`
        }).then(function (accomodationResponse){
            console.log(accomodationResponse);
        })
        })
    
