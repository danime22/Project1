// var queryURL = "https://www.dallasopendata.com/resource/are8-xahz.json?$limit=5000&$$app_token=kDCDojjY922O36hyR8W6vQ2nl";

// $.ajax({
//     url: queryURL,
//     method: "GET"

// }).then(function (response) {
//     console.log(response);

//     $("#click").on("click", function () {

//         for(i = 0; i < response.length; i++) {
//             var a = $("<p>");
//             a.html(response[i].beat + "<br>" + 
//                     response[i].block + "<br" +
//                     response[i].data_time + "<br" +
//                     response[i].division + "<br>" +
//                     response[i].incident_number + "<br>" +
//                     response[i].location+ "<br>" +
//                     response[i].nature_of_call + "<br>" +
//                     response[i].priority + "<br>" +
//                     response[i].reporting_area+ "<br>" +
//                     response[i].status + "<br>" +
//                     response[i].unit_number + "<br>");


//                     console.log(response[i].geolocation === undefined);

//             $("#show").append(a);
            

//         }

//         $("#click").hide();

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
            a.html(response[i].ag_forms + "<br>" + "<hr>" + 
                    response[i].case + "<br>" + "<hr>"+
                    response[i].date + "<br>"+ "<hr>" +
                    response[i].geolocation_address + "<br>" + "<hr>" +
                    response[i].geolocation_city + "<br>" + "<hr>"+
                    response[i].geolocation_state + "<br>" + "<hr>"+
                    response[i].grand_jury_disposition + "<br>" + "<hr>"+
                    response[i].location + "<br>" + "<hr>"+
                    response[i].officer_s + "<br>" + "<hr>"+
                    response[i].summary_url + "<br>" + "<hr>"+
                    response[i].suspect_deceased_injured_or_shoot_and_miss + "<br>" + "<hr>"+
                    response[i].suspect_s + "<br>" + "<hr>"+
                    response[i].suspect_weapon + "<br>" );

                    console.log(response[i].geolocation === undefined);

            $("#show").append(a);



        }

        $("#click").hide();



    })


});