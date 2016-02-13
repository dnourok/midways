var map;
var midLatLng = {};
//Map Style JSON data
var styles = [
  {
    "featureType": "poi",
    "stylers": [
      { "visibility": "on" }
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
//
ffunction initMap() {

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -40.739925299999996, lng: -73.98953879999999},
    zoom: 14,
    disableDefaultUI: true
  });
  directionsDisplay.setMap(map);
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
            
            midLatLng = {lat: route.overview_path[mid].lat(), lng: route.overview_path[mid].lng()};
            console.log(midLatLng);
            var infoWindowMid = new google.maps.InfoWindow({map: map});
            infoWindowMid.setPosition(midLatLng);
            infoWindowMid.setContent('Midway');
            document.getElementById('midpoint').value = [midLatLng.lat,midLatLng.lng];
          }
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
console.log(midLatLng);
