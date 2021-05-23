// Create the map with our layers
const myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});

// Create the tile layer that will be the background of our map
const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


/* This allows us to call in the URL for earthquakes in the past seven days and set it to the global variable URL.  If we want to change the dimensions of the data
that we are pulling in, this would be the place to change that */
//   https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

/* Bringing in the dataset and then placing markers with appropriate size and color related to the magnitude of the quake */
d3.json(URL, function (data) {
  let earthquakes = data.features;
  //    console.log(earthquakes);
  /*Sets up our color scheme for earthquakes */
  let color = {
      level1: "#3c0",
      level2: "#9f6",
      level3: "#fc3",
      level4: "#f93",
      level5: "#c60",
      level6: "#c00"
  }

  /* For each of the earthquakes, we are now identifying the lat/long and assessing a severity color to the earthquake */

  for (var i = 0; i < earthquakes.length; i++) {
      let latitude = earthquakes[i].geometry.coordinates[1];
      let longitude = earthquakes[i].geometry.coordinates[0];
      let magnitude = earthquakes[i].properties.mag;
      var fillColor;
      if (magnitude > 5) {
          fillColor = color.level6;
      } else if (magnitude > 4) {
          fillColor = color.level5;
      } else if (magnitude > 3) {
          fillColor = color.level4;
      } else if (magnitude > 2) {
          fillColor = color.level3;
      } else if (magnitude > 1) {
          fillColor = color.level2;
      } else {
          fillColor = color.level1;
      }

      /* The radius of each circle will be determined on an exponential scale based on the size of the magnitude.
       I chose to use exponential so that larger earthquakes will have a much higher radius than smaller earthquakes */
      var epicenter = L.circleMarker([latitude, longitude], {
          radius: magnitude ** 2,
          color: "black",
          fillColor: fillColor,
          fillOpacity: 1,
          weight: 1
      });
      epicenter.addTo(myMap);


      /* Set up labels as a pop-up when we use the mouse to point to one of the circles */

      epicenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude +
          "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");

  }

  /* Setting the legend to appear in the bottom right of our chart */
  var legend = L.control({
      position: 'bottomright'
  });

  /* Adding on the legend based off the color scheme we have */
  legend.onAdd = function (color) {
      var div = L.DomUtil.create('div', 'info legend');
      var levels = ['>1', '1-2', '2-3', '3-4', '4-5', '5+'];
      var colors = ['#3c0', '#9f6', '#fc3', '#f93', '#c60', '#c00']
      for (var i = 0; i < levels.length; i++) {
          div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
      }
      return div;
  }
  legend.addTo(myMap);
})
