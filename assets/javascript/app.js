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
          
    
  
})