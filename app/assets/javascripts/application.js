//init map renders the map on the page
"use strict";
(function(){


function createMarker(latlng) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: 'Midway'
        });
    console.log(marker);
    marker.setVisible(true);
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: latlng.lat, lng: latlng.lng},
    zoom: 16,
    disableDefaultUI: true
  });
    var infoWindowMid = new google.maps.InfoWindow({map: map});
    infoWindowMid.setPosition(latlng);
    infoWindowMid.setContent('Midway');
    map.setCenter(latlng);
    return marker;
}

function initMap() {

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 14,
    disableDefaultUI: true
  });
  directionsDisplay.setMap(map);

  
  var styles = [
  {
    "featureType": "poi",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "landscape.man_made",
    "stylers": [
      { "visibility": "on" }
    ]
  },{
    "featureType": "transit.station.rail",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "transit.station.rail",
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "on" }
    ]
  },
  {
    "featureType": "transit.line",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "stylers": [
      { "weight": 0 },
      { "lightness": 4 },
      { "hue": "#0022ff" }
    ]
  },{
  }
]


  var infoWindow = new google.maps.InfoWindow({map: map});
  var curr = [];
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      curr = [pos.lat,pos.lng];
      console.log(curr);
      infoWindow.setPosition(pos);
      infoWindow.setContent('Current Location');
      map.setCenter(pos);
      document.getElementById('start').value = [pos.lat,pos.lng];      
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  console.log(curr);
  map.setOptions({styles: styles});
  document.getElementById('submit').addEventListener('click', function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

//
//
//Directions Calculation
//
//
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,

    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.TRANSIT
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
      var path = response.routes[0].overview_path;
      // console.log(path);
      var summaryPanel = document.getElementById('directions-panel');
      summaryPanel.innerHTML = '';
      // For each route, display summary information.
      var totalDist = 0;
      var totalTime = 0;

        for (var i = 0; i < route.legs.length; i++) {
           var routeSegment = i + 1;
            summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
            summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
            summaryPanel.innerHTML += route.legs[i].end_address + '<br>';

            summaryPanel.innerHTML += 'distance text: ' + route.legs[i].distance.text + '<br><br>';
            summaryPanel.innerHTML += 'distance value: ' + route.legs[i].distance.value + '<br><br>';

            summaryPanel.innerHTML += 'duration text: ' + route.legs[i].duration.text + '<br><br>';
            summaryPanel.innerHTML += 'duration value: ' + route.legs[i].duration.value + '<br><br>';

            totalDist += route.legs[i].distance.value;
            totalTime += route.legs[i].duration.value;
            
            var distance = (50/100) * totalDist;
            var time = ((50/100) * totalTime/60).toFixed(2);
            var mid = Math.floor(route.overview_path.length / 2);
            
            var myLatLng = {lat: route.overview_path[mid].lat(), lng: route.overview_path[mid].lng()};
            console.log(myLatLng);
            createMarker(myLatLng);


          }
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
});
///
//
//
//
//
//
//
//
//Original Example From StackOverflow
//
//
//
//
//
//

