//HTML established to run JS
$(document).ready(function(){
    
    //Submit button onclick to pull top search results for the desired location so the user is able to select the exact location
    $("#submit").on("click", function(event){
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
            for (var i = 0; i < 5; i++){
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
                var searchResultsDiv = $("<div>");
                //creating buttons for each search result
                var searchResultsBtn = $("<button class='button btn-sm btn-primary searchButtons' id='btnz' val="+captureIds+">").text(capturePush);
                //organizing placement into html
                searchResultsDiv.append(searchResultsBtn);
                
                console.log(capturePush)
                //pushing the buttons into html
                $("#searchBar").append(searchResultsBtn);
            }
          })

          // Weather --------------------------------------------------------------------

          // url with API key to retreive forecast, city as variable and units fixed as imperial
          var weather = "https://api.openweathermap.org/data/2.5/forecast?q="+encodeURIComponent(input)+"&units=imperial&APPID=2c5299d78f7bf581a1a4bccad14eaddf";
          
          // universal array to alocate today and next days of the week
          var week = [];

          // Ajax call for weather API
          $.ajax({
              url: weather,
              method: "GET"
          }).then(function(response){
              // forecast for next five days as object, predictions are every three hours
              console.log(response);

            // print forecast as table for today and next four days as table, using prediction for each 24 hours
            // print forecast image using same images from font
            $("#weather").append("<table><tr><td>"+week[0]+"<p> Temp(F): "+response.list[0].main.temp+"<br>Weather: "+response.list[0].weather[0].main+
            "</p><br><img src='http://openweathermap.org/img/w/"+response.list[0].weather[0].icon+".png'></td><td>"+week[1]+"<p> Temp(F): "+response.list[8].main.temp+"<br>Weather: "+
            response.list[8].weather[0].main+"</p><br><img src='http://openweathermap.org/img/w/"+response.list[8].weather[0].icon+".png'></td><td>"+week[2]+"<p> Temp(F): "+response.list[16].main.temp
            +"<br>Weather: "+response.list[16].weather[0].main+"</p><br><img src='http://openweathermap.org/img/w/"+response.list[16].weather[0].icon+".png'></td><td>"+week[3]+"<p> Temp(F): "+
            response.list[24].main.temp+"<br>Weather: "+response.list[24].weather[0].main+"</p><br><img src='http://openweathermap.org/img/w/"+response.list[24].weather[0].icon+".png'></td><td>"+week[4]+"<p> Temp(F): "+
            response.list[32].main.temp+"<br>Weather: "+response.list[32].weather[0].main+"</p><br><img src='http://openweathermap.org/img/w/"+response.list[32].weather[0].icon+".png'></td></tr></table>");

      })

            // get current day and determine next days in order
              var d = new Date();
              var n = d.getDay();

                // depending current day, use corresponding week array
                  switch(n) {
                  case 0:
                      week = ["Sunday", "Monday",  "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                  break
                  case 1:
                      week = ["Monday",  "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                  break
                  case 2: 
                      week = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday"]
                  break
                  case 3: 
                      week = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday",  "Tuesday"]
                  break
                  case 4: 
                      week = ["Thursday", "Friday", "Saturday", "Sunday", "Monday",  "Tuesday", "Wednesday"]
                  break
                  case 5:
                      week = ["Friday", "Saturday", "Sunday", "Monday",  "Tuesday", "Wednesday", "Thursday"]
                  break
                  case 6:
                  week = ["Saturday", "Sunday", "Monday",  "Tuesday", "Wednesday", "Thursday", "Friday"]
                  break
              } 
          })


        })


    // $(".searchButtons").on("click", function(){
    //     alert("clicked");
        
    //     // var locationId = $(".searchButtons").val;
    //     // console.log(locationId)
    // })






        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
            //         var cityId = results[i].geonameid;
        //     for (var i = 0; i < results.length; i++){ 
        //         var cityTitle = results[i].asciiname;
                
        //         console.log(cityTitle)
        //         console.log(cityId)

        //         $("#city").text(cityTitle + "?");
        //         $("#cityExpense").text(cityTitle + "?");
        //     }
        //     var costApiUrl = "https://www.budgetyourtrip.com/api/v3/costs/location/"+cityId;
        //     console.log(costApiUrl)
        //     $.ajax({
        //         type:"GET",
        //         url: "https://thawing-woodland-40734.herokuapp.com/?apikey=$"+apiKey+"&link=$"+costApiUrl,
        //         }).then(function (costResponse){
        //             console.log(costResponse);
        //             var costResults = costResponse.data;
        //             console.log(costResults)
        //         })
        //   });
          
    
  
