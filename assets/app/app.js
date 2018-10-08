
var config = {
    apiKey: "AIzaSyBmy65eFPJ8elKkPkySIuBAk-z62R11NVA",
    authDomain: "project-myc.firebaseapp.com",
    databaseURL: "https://project-myc.firebaseio.com",
    projectId: "project-myc",
    storageBucket: "",
    messagingSenderId: "322670292591"
};
firebase.initializeApp(config);
var database = firebase.database();

var limit = 100;
var searchCoords = null; //global for the coordinates of the searched address
var shootingResponse = null; //this is a global var for shooting response


//function to get records for shooting history with two parameters(lattitude and longtitude)
function getShootingRecords(srcLat, srcLng) {
    console.log("shooting lat/long = " + srcLat + "/" + srcLng);
    records = []; //empty  array for records
    var queryURL = "https://www.dallasopendata.com/resource/s3jz-d6pf.json?$limit=" + limit + "&$$app_token=kDCDojjY922O36hyR8W6vQ2nl";

    // make the ajax query sync so that we can hang the response on the global to process in a function.
    $.ajax({
        url: queryURL,
        method: "GET",
        async: false,
        success: function (response) {
            shootingResponse = response;
        }
    });

    // loop the response data from JSON
    for (i = 0; i < shootingResponse.length; i++) {
        //console.log(shootingResponse[i]);

        var coords = null;

        //if the address has no geolocatin, get the lattitude and longtitude and convert to the nearest street location
        if (!shootingResponse[i].geolocation) {
            coords = getCoordinates(shootingResponse[i].location + " Dallas, TX");
            //console.log("found Coords: " + coords.lat + "/" + coords.lng);
        }
        else {
            //object that has the properties of lattitute and longitude from geolocation coordinates
            coords = {
                lat: shootingResponse[i].geolocation.coordinates[0],
                lng: shootingResponse[i].geolocation.coordinates[1]
            }
            //console.log("got Coords: " + coords.lat + "/" + coords.lng);
        }


        if (areCoordsWithinRegion(srcLat, srcLng, coords, 15)) {
            console.log("found one " + coords.lat + "/" + coords.lng);
            records.push({
                coords: coords,
                incident: shootingResponse[i]
            });
        }
    }

    return records;

}

var currentCalls = null;
function getCurrentCalls(srcLat, srcLng) {
    console.log("current lat/long = " + srcLat + "/" + srcLng);
    records = [];
    var queryURL = "https://www.dallasopendata.com/resource/are8-xahz.json?$limit=" + limit + "&$$app_token=kDCDojjY922O36hyR8W6vQ2nl";

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

        if (areCoordsWithinRegion(srcLat, srcLng, coords, 15)) {
            console.log("found one " + coords.lat + "/" + coords.lng);
            records.push({
                coords: coords,
                incident: currentCalls[i]
            });
        }
    }

    return records;
}


//function to point within X miles of the other point

function areCoordsWithinRegion(srcLat, srcLng, targetCoords, range) {
    return distance(srcLat, srcLng, targetCoords.lat, targetCoords.lng, "M") <= range;

}

//  function takes two coordinates and tells you the distance in miles between them.
// distance function is a bunch of crazy math. basically, it takes two global coordinates and does a bunch of geometer to tell you how many miles, it is crazy geometry because the distance changes based upon how high up or down on the globe you are.
function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
}

// this is to add a mark to the location that user search location including the lattitude and longtitude
function addLocationMark(lat, lng) {

    $(function () {

        $("#map").addMarker({
            coords: [lat, lng], // GPS coords
            title: "Search Location",
            // icon: "assets/images/map_mark_small.png",
            animation: google.maps.Animation.DROP
        });
    })
}

function addMark(lat, lng, icon) {
    $(function () {

        $("#map").addMarker({
            coords: [lat, lng], // GPS coords
            // title: title, // Title
            // text: txt, // HTML content
            animation: google.maps.Animation.DROP,
            icon: icon

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
$("#formSubmit").on("click", function (event) {
    event.preventDefault();
    var street = $("#streetName-input").val().trim();
    var city = $("#city-input").val().trim();
    var state = $("#state-input").val().trim();
    var zipCode = $("#zipCode-input").val().trim();
    console.log("text: " + street, city, state, zipCode);
    searchCoords = getCoordinates(street + " " + city + ", " + state + " " + zipCode);

    //TODO: check for coords of 0/0 if so, the address was invalid
    // ALSO, the can only search Dallas area.

    centerMap(searchCoords.lat, searchCoords.lng);
    addLocationMark(searchCoords.lat, searchCoords.lng);

    var location = {
        streetName: street,
        cityName: city,
        stateName: state,
        zip: zipCode
    };

    database.ref().push(location);
    $("#streetName-input").val("");
    $("#city-input").val("");
    $("#state-input").val("");
    $("#zipCode-input").val("");

});

database.ref().on("child_added", function (childSnapshot) {
    console.log("child" + childSnapshot.val());

    var a = childSnapshot.val().streetName;
    var b = childSnapshot.val().cityName;
    var c = childSnapshot.val().stateName;
    var d = childSnapshot.val().zip;
    console.log(a + b + c + d) + "work ork";
})

var shootingArray = null;
$("#shootingButton").on("click", function (e) {
    e.preventDefault();
    shootingArray = getShootingRecords(searchCoords.lat, searchCoords.lng);

    centerMap(searchCoords.lat, searchCoords.lng);
    addLocationMark(searchCoords.lat, searchCoords.lng);

    var container = $("#shootingTab");
    var createP = $("<p>");
    createP.addClass("shooting");

    container.append(createP);

    $("#crimeTabs").empty();
    for (i = 0; i < shootingArray.length; i++) {

        var html = "<p>Date: " + shootingArray[i].incident.date +
            "</p><p>Suspect: " + shootingArray[i].incident.suspect_s +
            "</p><p>Weapon: " + shootingArray[i].incident.suspect_weapon +
            "</p><p>Result: " + shootingArray[i].incident.suspect_deceased_injured_or_shoot_and_miss + "</p>";


        var caseMo = shootingArray[i].incident.date_time;
        var name = shootingArray[i].incident.suspect_s;
        var offense = shootingArray[i].incident.suspect_weapon;
        var date = shootingArray[i].incident.suspect_deceased_injured_or_shoot_and_miss


        var container = $("#crimeTabs");
        var createP = $("<p>");
        createP.addClass("address");
        createP.attr("data-id", i);
        createP.html(offense + "<br />" + date + "<br />" + name + "<br />" + caseMo);

        container.append(createP);


        addMark(shootingArray[i].coords.lat, shootingArray[i].coords.lng, "assets/images/icons8-shooting-40.png");
    }
});

$(document).on("click", ".address", addressClick);

function addressClick() {
    var item = $(this).attr("data-id");
    var coords = shootingArray[item].coords;
    centerMap(coords.lat, coords.lng);

    for (i = 0; i < shootingArray.length; i++) {
        addMark(shootingArray[i].coords.lat, shootingArray[i].coords.lng, "assets/images/icons8-shooting-40.png");

    }
}
var currentArray = null;
$("#callsButton").on("click", function (e) {
    e.preventDefault();

    currentArray = getCurrentCalls(searchCoords.lat, searchCoords.lng);

    centerMap(searchCoords.lat, searchCoords.lng);
    addLocationMark(searchCoords.lat, searchCoords.lng);

    $("#crimeTabs").empty();

    for (i = 0; i < currentArray.length; i++) {
        var html = "<p>Date: " + currentArray[i].incident.date_time +
            "</p><p>Priority: " + currentArray[i].incident.priority +
            "</p><p>Unit: " + currentArray[i].incident.unit_number +
            "</p><p>Status: " + currentArray[i].incident.status + "</p>";




        var caseMo = currentArray[i].incident.date_time;
        var name = currentArray[i].incident.priority;
        var offense = currentArray[i].incident.unit_number;
        var date = currentArray[i].incident.status


        var container = $("#crimeTabs");
        var createP = $("<p>");
        createP.addClass("calls");
        createP.attr("data-id", i);
        createP.html(offense + "<br />" + date + "<br />" + name + "<br />" + caseMo);

        container.append(createP);



        addMark(currentArray[i].coords.lat, currentArray[i].coords.lng, "");
    }
});

$(document).on("click", ".calls", currentClick);

function currentClick() {
    var item = $(this).attr("data-id");
    var coords = currentArray[item].coords;
    centerMap(coords.lat, coords.lng);

    for (i = 0; i < currentArray.length; i++) {
        addMark(currentArray[i].coords.lat, currentArray[i].coords.lng, "assets/images/icons8-shooting-40.png");

    }
}


function getIcon(crime) {
    var img = "";
    var root = "assets/images/";
    if (crime == "DRUNKENNESS") {
        img = root + "icons8-drunk-48.png";
    } else if (crime == "LARCENY/ THEFT OFFENSES") {
        img = root + "icons8-bandit-filled-50.png";
    } else if (crime == "MISCELLANEOUS") {
        img = root + "";
    } else if (crime == "ROBBERY") {
        img = root + "icons8-burglary-48.png";
    }



    return img;
}

var lastResp = null;

function getCoordinates(address) {
    console.log("converting: " + address);
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDlLaXHzolEt6dE-_eZi6llI_m5uRKQu-c&address=" + address;
    var lat = 0;
    var lng = 0;
    lastResp = null;
    $.ajax
        ({
            type: "GET",
            url: queryURL,
            async: false,
            success: function (response) {
                lastResp = response;
            }
        });

    //console.log(JSON.stringify(lastResp));
    if (lastResp.status == "ZERO_RESULTS") {
        lat = 0;
        lng = 0;
    }
    else {
        lat = lastResp.results[0].geometry.location.lat;
        lng = lastResp.results[0].geometry.location.lng;
    }

    return { lat: lat, lng: lng };
}



$("#crimeButton").on("click", function (e) {
    e.preventDefault();
    console.log("crime button");

    var recs = crimeHistory(searchCoords.lat, searchCoords.lng);

    centerMap(searchCoords.lat, searchCoords.lng);
    addLocationMark(searchCoords.lat, searchCoords.lng);

    var container = $("#shootingTab");
    var createP = $("<p>");
    createP.addClass("shooting");

    container.append(createP);




    for (i = 0; i < recs.length; i++) {

        var html = "<p>Date: " + recs[i].incident.upzdate +
            "</p><p>Suspect: " + recs[i].incident.ro1name +
            "</p><p>Status: " + recs[i].incident.status +
            "</p><p>Result: " + recs[i].incident.offincident + "</p>";

        var crimeAddress = crimeIncident[i].geocoded_column_address + " " + crimeIncident[i].geocoded_column_city + " " + crimeIncident[i].geocoded_column_state + " " + crimeIncident[i].geocoded_column_zip;

        var address = crimeAddress;
        var caseMo = crimeIncident[i].mo;
        var name = crimeIncident[i].ro1name;
        var offense = crimeIncident[i].nibrs_crime_category;
        var date = crimeIncident[i].reporteddate;


        var container = $("#crimeTabs");
        var createP = $("<p>");
        createP.addClass("address");
        createP.html(offense + "<br />" + address + "<br />" + date + "<br />" + name + "<br />" + caseMo);

        container.append(createP);




        addMark(recs[i].coords.lat, recs[i].coords.lng, getIcon(recs[i].incident.nibrs_crime_category));

    }
});

var crimeIncident = null;
function crimeHistory(srcLat, srcLng) {

    var history = [];
    var queryUrl = "https://www.dallasopendata.com/resource/9s22-2qus.json?$limit=4000&$$app_token=kDCDojjY922O36hyR8W6vQ2nl&$order=edate%20DESC";

    $.ajax({
        url: queryUrl,
        method: "GET",
        async: false,
        success: function (response) {
            crimeIncident = response;

        }
    });

    for (i = 0; i < crimeIncident.length; i++) {


        var coords = null;

        console.log(crimeIncident[i].nibrs_crime_category)

        if (!crimeIncident[i].geocoded_column) {
            coords =
                coords = getCoordinates(crimeIncident[i].comphaddress + " Dallas, TX");
            console.log("found fucking coords! " + coords.lat + "/" + coords.lng);

        } else {
            coords = {
                lat: crimeIncident[i].geocoded_column.coordinates[0],
                lng: crimeIncident[i].geocoded_column.coordinates[1],
            }
            console.log("got coords: " + coords.lat + "/" + coords.lng);
        }

        if (areCoordsWithinRegion(srcLat, srcLng, coords, 15)) {
            history.push({
                coords: coords,
                incident: crimeIncident[i]
            });
        }

    }

    return history;
}



var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 32.7766642, lng: -96.79698789999999 },
        zoom: 10,
        mapTypeId: 'terrain'

    });
}
// register a user
//returns true if user registered, false if not.
function registerUser(username, password, email, street, city, state, zip, range) {

}

//return true if logged in, false if not
function login(username, password) {

}

// get's the stored users search location
// returns the following object:
// {
//     street
//     city
//     state
//     zip
//     range
// }
function getUserSearchLocation(username) {

}