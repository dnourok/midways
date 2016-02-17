
var map;
var midLatLng = {};

//Map Style JSON data
var styles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#ff6a6a"
            },
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ff6a6a"
            },
            {
                "lightness": "75"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "75"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.bus",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "labels.icon",
        "stylers": [
            {
                "weight": "0.01"
            },
            {
                "hue": "#ff0028"
            },
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#80e4d8"
            },
            {
                "lightness": "25"
            },
            {
                "saturation": "-23"
            }
        ]
    }
]

	var aStart;
	var bStart;
	var cuisine = 'italian';
	var meetTime = 7;
	var budget;
	var destination;
    var responses;

var places_data = [];

function initMap() {

	// init map part one calls up google maps API

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var curr = {lat: 40.750671, lng: -73.985239}

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      curr.lat = pos.lat;
      curr.lng = pos.lng;

      // curr becomes the default input of the persons current location (so the user)
      // this means the person initiating the meetup in the app is shown as "your start"
      
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
console.log(curr)
  map = new google.maps.Map(document.getElementById('map'), {
    center: curr,
    zoom: 14,
    disableDefaultUI: true
  });
  directionsDisplay.setMap(map);

// the info window drops "current location" marker

  var infoWindow = new google.maps.InfoWindow({map: map});
  
  // Try HTML5 geolocation.
  
  map.setOptions({styles: styles});
  document.getElementById('submit').addEventListener('click', function() {
  	aStart = document.getElementById('start').value;
  	bStart = document.getElementById('end').value;
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });
 
}

function displayChoices(choices){
    debugger
    choices.forEach(function(choice,i){
        var reference = choice.photos[0].photo_reference;
        var apiKey = choice.photos[0].api_key;
        var choiceImgUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + reference + "&key=" + apiKey;
        var card = $('<div>', {'class': 'card'});
        var cardB = $('<div>', {'class': 'card-block'});
        var cardW = $('<div>', {'class': 'card-wrapper'});

        $('<img>', {'class': 'card-img-top'}).attr("src", choiceImgUrl).appendTo(cardW);
        cardW.appendTo(cardB);
        $('<h4>', {'class': 'card-title'}).text(choice.name).appendTo(cardB);
        var uList = $('<ul>', {'class': 'list-group list-group-flush'});
        var iList1 = $('<li>', {'class': 'list-group-item'});
            $('<span>', {'class': 'glyphicon glyphicon-map-marker'}).appendTo(iList1);
        var iList2 = $('<li>', {'class': 'list-group-item'});
            $('<span>', {'class': 'glyphicon glyphicon-star'}).appendTo(iList2);
        var iList3 = $('<li>', {'class': 'list-group-item'});
            $('<span>', {'class': 'glyphicon glyphicon-usd'}).appendTo(iList3);
        iList1.text(choice.vicinity).appendTo(uList);
        iList2.text(choice.rating).appendTo(uList);
        iList3.text(choice.price_level).appendTo(uList);
        uList.appendTo(cardB);
        $('<button>', {'class': 'btn btn-primary btn-sm', 'id': 'choice' + i, 'type': 'button'}).text('Meet Here').appendTo(cardB);

        cardB.appendTo(card);
        card.appendTo('#cardTest')
    });

};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

// handleLocationError gives an error if the location doesnt exist
//
// directions calculation
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,

    // callback for calculateAndDisplayRoute (shows a to b)
  	provideRouteAlternatives: true,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.TRANSIT
  }, function(response, status) {  	
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      // debugger
      var route = response.routes[0];
      var r1hd = route.legs[0].distance.value / 2;
      console.log("num of routes" + response.routes.length)
      var path = route.overview_path;
           
    	var half_length = 0;
    	var half_length_old = 0;

    	var mid;
    	// debugger
    	var notfound = true
    	var between;
    	// calculates the distance between each point in the path and produces the first point past the middle distance
    	for(i=1; half_length < r1hd; i++){
    		half_length_old = half_length;
    		var in_btw = google.maps.geometry.spherical.computeDistanceBetween(path[i],path[i-1]); 
    		half_length += in_btw;
    		if (half_length > r1hd){
    			mid = i;
    			between = in_btw;
    		};
    	};
    	// calculates the distance back from the end to the actual middle of route
    	var back_dist = half_length - r1hd;
    	// calculates the heading between the two points around the true middle of the route
    	var heading = google.maps.geometry.spherical.computeHeading(path[mid], path[mid-1])
    	// calculates the true middle of the route and produces a point
    	var newMid = google.maps.geometry.spherical.computeOffset(path[mid], back_dist, heading);
			
      // midLatLng = {lat: route.overview_path[mid].lat(), lng: route.overview_path[mid].lng()};
      // midLatLng = {lat: newMid.lat(), lng: newMid.lng()};

      var midMarker = new google.maps.Marker({map: map})
      midMarker.setPosition(newMid);
      midMarker.setTitle('New Mid');
      destination = newMid;
      // var infoWindowMid = new google.maps.InfoWindow({map: map});
      // infoWindowMid.setPosition(midLatLng);
      // infoWindowMid.setContent('Midway');
      // document.getElementById('midpoint').value = [midLatLng.lat,midLatLng.lng];
    } else {
      window.alert('Directions request failed due to ' + status);
    };

    $.ajax({
        url : "/maps",
        type : "post",
        data : { cuisine: JSON.stringify(cuisine), meetTime: JSON.stringify(meetTime), destinationLat: JSON.stringify(destination.lat()), destinationLng: JSON.stringify(destination.lng()) },
        success: function(response) {
		    	// alert("response received");
                responses = response
                console.log(response)
                // debugger
                displayChoices(responses)
		      }
    });


  });
}

console.log(responses);
console.log(midLatLng);
