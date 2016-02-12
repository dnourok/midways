var markers = Array();
var infos = Array();
var contentString = '<div id="content">'+
      '</div>';
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
function createPlaceMarker(obj) {

    // prepare new Marker object
    var mark = new google.maps.Marker({
        position: obj.geometry.location,
        map: map,
        title: obj.name
    });
    markers.push(mark);

    // prepare info window
    var placeinfowindow = new google.maps.InfoWindow({
        content: '<img src="' + obj.icon + '" /><font style="color:#000;">' + obj.name + 
        '<br />Rating: ' + obj.rating + '<br />Vicinity: ' + obj.vicinity + '</font>'
    });

    // add event handler to current marker
    google.maps.event.addListener(mark, 'click', function() {
        clearInfos();
        placeinfowindow.open(map,mark);
    });
    infos.push(placeinfowindow);
}
//
function clearOverlays() {
    if (markers) {
        for (i in markers) {
            markers[i].setMap(null);
        }
        markers = [];
        infos = [];
    }
}

// clear infos function
function clearInfos() {
    if (infos) {
        for (i in infos) {
            if (infos[i].getMap()) {
                infos[i].close();
            }
        }
    }
}
//
//
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
    var map = new google.maps.Map(document.getElementById('map'), 
    {
      center: {lat: latlng.lat, lng: latlng.lng},
      zoom: 16,
      disableDefaultUI: true
    });
    var infoWindowMid = new google.maps.InfoWindow({map: map});
    infoWindowMid.setPosition(latlng);
    infoWindowMid.setContent('Midway');
    map.setCenter(latlng);
    map.setOptions({styles: styles});
    //Populate area with search by cuisine p1:
    //
    // 
    // var type = document.getElementById('cuisine').value;
    // var radius = document.getElementById('gmap_radius').value;
    var keyword = document.getElementById('cuisine').value;
    var request = {
        location: latlng,
        radius: 1500,
        types: "food"
    };
    if (keyword) {
        request.keyword = [keyword];
    }
    // send request
    service = new google.maps.places.PlacesService(map);
    service.search(request, createMarkers);
    //
    findPlaces();
    console.log(request);   
}
//
function createMarkers(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        // if we have found something - clear map (overlays)
        clearOverlays();

        // and create new markers by search result
        for (var i = 0; i < results.length; i++) {
            createPlaceMarker(results[i]);
        }
    } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        alert('Sorry, nothing is found');
    }
}
//init map renders the map on the page
function initMap() {

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
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
function findPlaces() {

    // prepare variables (filter)
    // var type = document.getElementById('gmap_type').value;
    var radius = document.getElementById('gmap_radius').value;
    var keyword = document.getElementById('gmap_keyword').value;

    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;
    var cur_location = new google.maps.LatLng(lat, lng);

    // prepare request to Places
    var request = {
        location: cur_location,
        radius: radius,
        
    };
    if (keyword) {
        request.keyword = [keyword];
    }

    // send request
    service = new google.maps.places.PlacesService(map);
    service.search(request, createMarkers);
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

///
///
///
///

///
//
//
// function initialize() {
//   // Create a map to show the results, and an info window to
//   // pop up if the user clicks on the place marker.
//   var pyrmont = new google.maps.LatLng(-33.8665, 151.1956);

//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: pyrmont,
//     zoom: 15,
//     scrollwheel: false
//   });
//   var infowindow = new google.maps.InfoWindow();
//   var service = new google.maps.places.PlacesService(map);

//   document.getElementById('submit').addEventListener('click', function() {
//     placeDetailsByPlaceId(service, map, infowindow);
//   });
// }

// function placeDetailsByPlaceId(service, map, infowindow) {
//   // Create and send the request to obtain details for a specific place,
//   // using its Place ID.
//   var request = {
//     placeId: document.getElementById('place-id').value
//   };

//   service.getDetails(request, function (place, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//       // If the request succeeds, draw the place location on the map
//       // as a marker, and register an event to handle a click on the marker.
//       var marker = new google.maps.Marker({
//         map: map,
//         position: place.geometry.location
//       });

//       google.maps.event.addListener(marker, 'click', function() {
//         infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
//           'Place ID: ' + place.place_id + '<br>' +
//           place.formatted_address + '</div>');
//         infowindow.open(map, this);
//       });

//       map.panTo(place.geometry.location);
//     }
//   });
// }

// // Run the initialize function when the window has finished loading.
// google.maps.event.addDomListener(window, 'load', initialize);

// var geocoder;
// var map;
// var markers = Array();
// var infos = Array();

// function initialize() {
//     // prepare Geocoder
//     geocoder = new google.maps.Geocoder();

//     // set initial position (New York)
//     var myLatlng = new google.maps.LatLng(40.7143528,-74.0059731);

//     var myOptions = { // default map options
//         zoom: 14,
//         center: myLatlng,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//     map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
// }

// // clear overlays function
// function clearOverlays() {
//     if (markers) {
//         for (i in markers) {
//             markers[i].setMap(null);
//         }
//         markers = [];
//         infos = [];
//     }
// }

// // clear infos function
// function clearInfos() {
//     if (infos) {
//         for (i in infos) {
//             if (infos[i].getMap()) {
//                 infos[i].close();
//             }
//         }
//     }
// }

// // find address function
// function findAddress() {
//     var address = document.getElementById("gmap_where").value;

//     // script uses our 'geocoder' in order to find location by address name
//     geocoder.geocode( { 'address': address}, function(results, status) {
//         if (status == google.maps.GeocoderStatus.OK) { // and, if everything is ok

//             // we will center map
//             var addrLocation = results[0].geometry.location;
//             map.setCenter(addrLocation);

//             // store current coordinates into hidden variables
//             document.getElementById('lat').value = results[0].geometry.location.lat();
//             document.getElementById('lng').value = results[0].geometry.location.lng();

//             // and then - add new custom marker
//             var addrMarker = new google.maps.Marker({
//                 position: addrLocation,
//                 map: map,
//                 title: results[0].formatted_address,
//                 icon: 'marker.png'
//             });
//         } else {
//             alert('Geocode was not successful for the following reason: ' + status);
//         }
//     });
// }

// // find custom places function
// function findPlaces() {

//     // prepare variables (filter)
//     var type = document.getElementById('gmap_type').value;
//     var radius = document.getElementById('gmap_radius').value;
//     var keyword = document.getElementById('gmap_keyword').value;

//     var lat = document.getElementById('lat').value;
//     var lng = document.getElementById('lng').value;
//     var cur_location = new google.maps.LatLng(lat, lng);

//     // prepare request to Places
//     var request = {
//         location: cur_location,
//         radius: radius,
//         types: [type]
//     };
//     if (keyword) {
//         request.keyword = [keyword];
//     }

//     // send request
//     service = new google.maps.places.PlacesService(map);
//     service.search(request, createMarkers);
// }

// // create markers (from 'findPlaces' function)
// function createMarkers(results, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {

//         // if we have found something - clear map (overlays)
//         clearOverlays();

//         // and create new markers by search result
//         for (var i = 0; i < results.length; i++) {
//             createMarker(results[i]);
//         }
//     } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
//         alert('Sorry, nothing is found');
//     }
// }

// // creare single marker function
// function createMarker(obj) {

//     // prepare new Marker object
//     var mark = new google.maps.Marker({
//         position: obj.geometry.location,
//         map: map,
//         title: obj.name
//     });
//     markers.push(mark);

//     // prepare info window
//     var infowindow = new google.maps.InfoWindow({
//         content: '<img src="' + obj.icon + '" /><font style="color:#000;">' + obj.name + 
//         '<br />Rating: ' + obj.rating + '<br />Vicinity: ' + obj.vicinity + '</font>'
//     });

//     // add event handler to current marker
//     google.maps.event.addListener(mark, 'click', function() {
//         clearInfos();
//         infowindow.open(map,mark);
//     });
//     infos.push(infowindow);
// }

// // initialization
// google.maps.event.addDomListener(window, 'load', initialize);
