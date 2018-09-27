// var queryURL = "https://www.dallasopendata.com/resource/are8-xahz.json?$limit=5000&$$app_token=kDCDojjY922O36hyR8W6vQ2nl";

// $.ajax({
//     url: queryURL,
//     method: "GET"

// }).then(function (response) {
//     console.log(response);

//     $("#click").on("click", function () {

//         console.log("hey");


//         $("#1").text(response[0].beat);
//         $("#2").text(response[0].block);
//         $("#3").text(response[0].date_time);
//         $("#4").text(response[0].division);
//         $("#5").text(response[0].incident_number);
//         $("#6").text(response[0].location);
//         $("#7").text(response[0].nature_of_call);
//         $("#8").text(response[0].priority);
//         $("#9").text(response[0].reporting_area);
//         $("#10").text(response[0].status);
//         $("#11").text(response[0].unit_number);





//     })


// });

var queryURL = "https://www.dallasopendata.com/resource/s3jz-d6pf.json";

$.ajax({
    url: queryURL,
    method: "GET"

}).then(function (response) {
    console.log(response);

    $("#click").on("click", function () {

        for (i = 0; i < response.length; i++) {

            if(response[i].geolocation === undefined) {
                //call googlemaps API to convert the location to geolocation coordinates
            }

            var a = $("<p>");
            a.html(response[i].ag_forms + "<br>" + 
                    response[i].case + "<br" +
                    response[i].date + "<br" +
                    response[i].geolocation_address + "<br>" +
                    response[i].geolocation_city + "<br>" +
                    response[i].geolocation_state + "<br>" +
                    response[i].grand_jury_disposition + "<br>" +
                    response[i].location + "<br>" +
                    response[i].officer_s + "<br>" +
                    response[i].summary_url + "<br>" +
                    response[i].suspect_deceased_injured_or_shoot_and_miss + "<br>" +
                    response[i].suspect_s + "<br>" +
                    response[i].suspect_weapon + "<br>" );

                    console.log(response[i].geolocation === undefined);

            $("#show").append(a);



        }

        console.log("hey");








    })


});