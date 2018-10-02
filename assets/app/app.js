var shootingResponse = null;
function getShootingRecords(srcLat, srcLng) {
    console.log("shooting lat/long = " + srcLat + "/" + srcLng);
    records = [];
    var queryURL = "https://www.dallasopendata.com/resource/s3jz-d6pf.json?$limit=5000&$$app_token=kDCDojjY922O36hyR8W6vQ2nl";

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
                lat: shootingResponse[i].geolocation.coordinates[0],
                lng: shootingResponse[i].geolocation.coordinates[1]
            }
            console.log("got Coords: " + coords.lat + "/" + coords.lng);
        }

        if (areCoordsWithinRegion(srcLat, srcLng, coords, 0.10) ){
            console.log("found one " + coords.lat + "/" + coords.lng);
            records.push(coords);
        }
    }

    return records;

}

var currentCalls = null;
function getCurrentCalls(srcLat, srcLng) {
    console.log("current lat/long = " + srcLat + "/" + srcLng);
    records = [];
    var queryURL = "https://www.dallasopendata.com/resource/are8-xahz.json?$limit=5000&$$app_token=kDCDojjY922O36hyR8W6vQ2nl";

    $.ajax({
        url: queryURL,
        method: "GET",
        async: false,
        success: function (response) {
            currentCalls = response;
        }
    });

    for (i = 0; i < currentCalls.length; i++) {
        console.log(currentCalls[i]);

        var address = "";
        if (currentCalls[i].block) {
            address += currentCalls[i].block + " ";
        } 
        
        address += currentCalls[i].location + " Dallas, TX";

        var coords = getCoordinates(address);

        if (areCoordsWithinRegion(srcLat, srcLng, coords, 0.10)) {
            console.log("found one " + coords.lat + "/" + coords.lng);
            records.push(coords);
        }
    }

    return records;
}



function areCoordsWithinRegion(srcLat, srcLng, targetCoords, range) {
    
    return (targetCoords.lat < srcLat + range && 
            targetCoords.lat > srcLat - range && 
            targetCoords.lng < srcLng + range && 
            targetCoords.lng > srcLng - range);
}


function addMark(lat, lng) {

    $(function () {

        $("#map").addMarker({
            coords: [lat, lng], // GPS coords
            title: 'Shooting Incident', // Title
            text: ""// HTML content

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

$("#shootings").on("click", function () {
    var search = $("#map-input").val().trim();
    console.log("Shooting: " + search);
    var coords = getCoordinates(search);

    var recs = getShootingRecords(coords.lat, coords.lng);

    centerMap(coords.lat, coords.lng);

    for (i = 0; i < recs.length; i++) {
        addMark(recs[i].lat, recs[i].lng);
    }
});

$("#current").on("click", function () {
    var search = $("#map-input").val().trim();
    console.log("Current: " + search);
    var coords = getCoordinates(search);

    var recs = getCurrentCalls(coords.lat, coords.lng);

    centerMap(coords.lat, coords.lng);

    for (i = 0; i < recs.length; i++) {
        addMark(recs[i].lat, recs[i].lng);
    }
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



var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 32.7766642, lng: -96.79698789999999 },
        zoom: 10
    });
}
