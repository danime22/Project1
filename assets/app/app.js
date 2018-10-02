var shootingResponse = null;
function getShootingRecords(srcLat, srcLng) {
    console.log("lat/long = " + srcLat + "/" + srcLng); 
    records = [];
    var queryURL = "https://www.dallasopendata.com/resource/are8-xahz.json?$limit=5000&$$app_token=kDCDojjY922O36hyR8W6vQ2nl";

    $.ajax({
        url: queryURL,
        method: "GET",
        async: false,
        success: function (response) {
            shootingResponse = response;
        }
    });

    for (i = 0; i < shootingResponse.length; i++) {
        console.log(shootingResponse[i]);
        var coords = null;
        if (!shootingResponse[i].geolocation) {
            coords = getCoordinates(shootingResponse[i].location + " Dallas, TX");
            console.log("found Coords: " + coords.lat + "/" + coords.lng);
        }
        else {
            coords = {
                lat: shootingResponse[i].geolocation.coords[0],
                lng: shootingResponse[i].geolocation.coords[1]
            }
            console.log("got Coords: " + coords.lat + "/" + coords.lng);
        }

        if (coords.lat < srcLat + 0.05 && coords.lat > srcLat - 0.05
            && coords.lng < srcLng + 0.05 && coords.lng > srcLng - 0.05) {
                console.log ("found one " + coords.lat +"/" + coords.lng);
                records.push(coords);
        }
    }

    return records;

}
// var queryURL = "https://www.dallasopendata.com/resource/are8-xahz.json?$limit=5000&$$app_token=kDCDojjY922O36hyR8W6vQ2nl";

// $.ajax({
//     url: queryURL,
//     method: "GET"

// }).then(function (response) {
//     console.log(response);

//     $("#click").on("click", function () {
// alert("hey");
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

//     });


// });

// var queryURL = "https://www.dallasopendata.com/resource/s3jz-d6pf.json";

// $.ajax({
//     url: queryURL,
//     method: "GET"

// }).then(function (response) {
//     console.log(response);


// });

function addMark(lat, lng) {

    $(function () {

        $("#map").addMarker({
            coords: [lat, lng], // GPS coords
            title: 'Shooting Incident', // Title
            text: shootingResponse// HTML content

        });
    })
}

function centerMap(lat, lng) {
    $(function () {
        $("#map").googleMap({
            zoom: 10, // Initial zoom level (optional)
            coords: [lat, lng], // Map center (optional)
            type: "ROADMAP" // Map type (optional)
        });
    });
}

$("#click").on("click", function () {
    var search = $("#map-input").val().trim();
    console.log("Searching: " + search);
    var coords = getCoordinates(search);

    var recs = getShootingRecords(coords.lat, coords.lng);

    centerMap(coords.lat, coords.lng);

    for(i=0; i<recs.length; i++) {
        addMark(recs[i].lat, recs[i].lng);
    }


    // for (i = 0; i < response.length; i++) {

    //     // if(response[i].geolocation === undefined) {
    //     //     //call googlemaps API to convert the location to geolocation coordinates
    //     // }

    //     var a = $("<p>");
    //     a.html(response[i].ag_forms + "<br>" + "<hr>" +
    //         response[i].case + "<br>" + "<hr>" +
    //         response[i].date + "<br>" + "<hr>" +
    //         response[i].geolocation_address + "<br>" + "<hr>" +
    //         response[i].geolocation_city + "<br>" + "<hr>" +
    //         response[i].geolocation_state + "<br>" + "<hr>" +
    //         response[i].grand_jury_disposition + "<br>" + "<hr>" +
    //         response[i].location + "<br>" + "<hr>" +
    //         response[i].officer_s + "<br>" + "<hr>" +
    //         response[i].summary_url + "<br>" + "<hr>" +
    //         response[i].suspect_deceased_injured_or_shoot_and_miss + "<br>" + "<hr>" +
    //         response[i].suspect_s + "<br>" + "<hr>" +
    //         response[i].suspect_weapon + "<br>");

    //     console.log(response[i].geolocation === undefined);

    //     $("#show").append(a);

    // }

    // $("#click").hide();

});

var lastResp = null;

function getCoordinates(address) {
    console.log("converting: " + address);
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDlLaXHzolEt6dE-_eZi6llI_m5uRKQu-c&address=" + address;
    var lat = 0;
    var lng = 0;

    $.ajax
        ({
            type: "GET",
            url: queryURL,
            async: false,
            success: function (response) {
                lastResp = response;
            }
        });

    lat = lastResp.results[0].geometry.location.lat;
    lng = lastResp.results[0].geometry.location.lng;

    return { lat: lat, lng: lng };
}



// window.response = function (results) {
//     for (i = 0; i < response.length; i++) {
//         var coord = results.response[i].geometry.coordinates;
//         var latLng = new google.maps.LatLng(coord[1], coord[0]);
//         var marker = new google.maps.Marker({
//             position: latLng,
//             map: map
//         });
//     }
// }


var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 32.7766642, lng: -96.79698789999999 },
        zoom: 10
    });
}

// initMap();

// var queryURL = "https://www.dallasopendata.com/resource/s3jz-d6pf.json";

// $.ajax({
//     url: queryURL,
//     method: "GET"

// }).then(function (response) {
//     console.log(response);

//     $("#click").on("click", function () {

//         for (i = 0; i < response.length; i++) {

//             if(response[i].geolocation === undefined) {
//                 //call googlemaps API to convert the location to geolocation coordinates
//             }

//             var a = $("<p>");
//             a.html(response[i].ag_forms + "<br>" + "<hr>" + 
//                     response[i].case + "<br>" + "<hr>"+
//                     response[i].date + "<br>"+ "<hr>" +
//                     response[i].geolocation_address + "<br>" + "<hr>" +
//                     response[i].geolocation_city + "<br>" + "<hr>"+
//                     response[i].geolocation_state + "<br>" + "<hr>"+
//                     response[i].grand_jury_disposition + "<br>" + "<hr>"+
//                     response[i].location + "<br>" + "<hr>"+
//                     response[i].officer_s + "<br>" + "<hr>"+
//                     response[i].summary_url + "<br>" + "<hr>"+
//                     response[i].suspect_deceased_injured_or_shoot_and_miss + "<br>" + "<hr>"+
//                     response[i].suspect_s + "<br>" + "<hr>"+
//                     response[i].suspect_weapon + "<br>" );

//                     console.log(response[i].geolocation === undefined);

//             $("#show").append(a);



//         }

//         $("#click").hide();



//     })


// });

// function initMap() {
//     var map = new google.maps.Map($("#map"), {
//         center: {lat: -33.86888, lng: 151.2195},
//         zoom: 14,
//         mapType: "roadmap"
//     });

//     var inout = $("#map-input");
//     var search = new google.maps.places.SearchBox(inout);
//     map.congtrols[google.maps.controlPosition.TOP_LEFT]
// }

