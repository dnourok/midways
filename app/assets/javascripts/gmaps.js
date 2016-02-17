
var map;
var midLatLng = {};

//Map Style JSON data
var styles = [
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "hue": "#ff0000"
            },
            {
                "saturation": "25"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#e0efef"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#1900ff"
            },
            {
                "color": "#c0e8e8"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ff0000"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "-12"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#5d5959"
            },
            {
                "visibility": "on"
            },
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 700
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#7dcdcd"
            }
        ]
    }
]

	var aStart;
	var bStart;
	var cuisine;
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
    cuisine = document.getElementById('cuisine').value; 
    console.log(cuisine);
    $('#preferences').hide()   
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });
 
}

function displayChoices(choices){
 
    choices.forEach(function(choice,i){
        if(i < 3){
          if(choice.photos.length > 0){
              var reference = choice.photos[0].photo_reference;
              var apiKey = choice.photos[0].api_key;
              var choiceImgUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + reference + "&key=" + apiKey;
          }else{
              var choiceImgUrl = "https://images.unsplash.com/photo-1428515613728-6b4607e44363?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=cf15c9c7e1a74cdb8dc1a53d3cc09ec6";
          }
          var card = $('<div>', {'class': 'card'});
          var cardB = $('<div>', {'class': 'card-block'});
          var cardW = $('<div>', {'class': 'card-wrapper'});

          $('<img>', {'class': 'card-img-top'}).attr("src", choiceImgUrl).appendTo(cardW);
          cardW.appendTo(cardB);
          $('<h4>', {'class': 'card-title'}).text(choice.name).appendTo(cardB);
          var uList = $('<ul>', {'class': 'list-group list-group-flush'});
          var iList1 = $('<li>', {'class': 'list-group-item'});
            iList1.text(choice.vicinity);
            iList1.wrapInner( "<span class='glyphicon glyphicon-map-marker'></span>");
            iList1.appendTo(uList);
          var iList2 = $('<li>', {'class': 'list-group-item'});
            iList2.text(choice.rating);
            iList2.wrapInner( "<span class='glyphicon glyphicon-star'></span>");
            iList2.appendTo(uList);
          var iList3 = $('<li>', {'class': 'list-group-item'});
            iList3.text(choice.price_level);
            iList3.wrapInner( "<span class='glyphicon glyphicon-usd'></span>");
            iList3.appendTo(uList);
          
          uList.appendTo(cardB);
          
          var buttonF = $('<form>',{'class': 'email', 'action': '/confirmation_emails/new', 'method': 'post'});
            $('<input>', {'type': 'hidden', 'name': 'address', 'value': choice.vicinity}).appendTo(buttonF);
            $('<input>', {'type': 'hidden', 'name': 'name', 'value': choice.name}).appendTo(buttonF);
            $('<input>', {'type': 'text', 'name': 'phone'}).appendTo(buttonF);
            $('<input>', {'class': 'btn btn-primary btn-sm', 'id': 'choice' + i, 'type': 'button', 'value': 'Meet Here'}).appendTo(buttonF);
          buttonF.appendTo(cardB);

          cardB.appendTo(card);
          card.appendTo('#cardTest')
        }
    });

};
// var ckui = document.getElementById('ckui').value;
// var ckroute_id = document.getElementById('ckroute_id').value;
// var ck_addr = document.getElementById('ck_addr').value;
// var ck_from_no = document.getElementById('ck_from_no').value;

document.getElementById("choice0").addEventListener('click', function(){
        postText(0);
    });
$("#choice1").click(function(){
        postText(1);
    });
$("#choice2").click(function(){
        postText(2);
    });
function postText(i){
  $.post("");
}
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
