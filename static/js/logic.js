// Creating map object
var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 11
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  

// Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php";
var title = "$where=created_date between'2016-01-01T00:00:00' and '2017-01-01T00:00:00'";
var status = "200";
var api ="1.10.3"
var count = "2046";

// Assemble API query URL
var url = baseURL + title + status + api + count;

// Grab the data with d3
d3.json(url).then(function(response) {


