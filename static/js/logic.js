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


// Set the URL to get data 
//   https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// get data 
d3.json(URL, function (data) {
  let earthquakes = data.features;
  //    console.log(earthquakes);
  // apply color scheme
  let color = {
      level1: "#3c0",
      level2: "#9f6",
      level3: "#fc3",
      level4: "#f93",
      level5: "#c60",
      level6: "#c00"
  }

  // Loop through url data 

  for (var i = 0; i < earthquakes.length; i++) {
      let latitude = earthquakes[i].geometry.coordinates[1];
      let longitude = earthquakes[i].geometry.coordinates[0];
      let depth = earthquakes[i].geometry.coordinates[2];
      let magnitude = earthquakes[i].properties.mag;
      var fillColor;
      if (magnitude > 90) {
          fillColor = color.level6;
      } else if (magnitude*depth > 70) {
          fillColor = color.level5;
      } else if (magnitude*depth  > 50) {
          fillColor = color.level4;
      } else if (magnitude*depth  > 30) {
          fillColor = color.level3;
      } else if (magnitude*depth  > 10) {
          fillColor = color.level2;
      } else {
          fillColor = color.level1;
      }

//
      var epicenter = L.circleMarker([latitude, longitude], {
          radius: magnitude ** 2,
          color: "black",
          fillColor: fillColor,
          fillOpacity: 1,
          weight: 1
      });
      epicenter.addTo(myMap);


      // set Pop up labels

      epicenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude + 
      "<br>Depth: " + depth +
          "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");

  }

  // set legend position
  var legend = L.control({
      position: 'bottomright'
  });

  // add legend 
  legend.onAdd = function (color) {
      var div = L.DomUtil.create('div', 'info legend');
      var levels = ['-10 -10', '10-30', '30-50', '50-70', '70-90', '90+'];
      var colors = ['#3c0', '#9f6', '#fc3', '#f93', '#c60', '#c00']
      for (var i = 0; i < levels.length; i++) {
          div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
      }
      return div;
  }
  legend.addTo(myMap);
})
