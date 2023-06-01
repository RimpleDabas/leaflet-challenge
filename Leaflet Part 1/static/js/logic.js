// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// console log to see the data format

d3.json(queryUrl).then(function (data) {
  console.log(data);
});
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: Markers
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  // // Add legend specifics
var legend = L.control({position: "bottomright"});

legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend"),
    depths = [5, 20, 40, 50, 60, 70];

    div.innerHTML += "<h3 style='text-align: center'>Depths</h3>"
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML += '<i style=”background:' + depthColor(depths[i] + 1) + '"></i> '+ depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
        
}
legend.addTo(myMap)
}

function markerSize(magnitude) {
    return (magnitude) *5;
}

function depthColor(d) {
    return d < 5 ? "#ebd234" :
    d < 20 ? "#b4eb34" :
    d < 40 ? "#34eb8c" :
    d < 50 ? "#34ebba" :
    d < 60 ? "#349eeb" :
    "#eb3461";
    }
// function depthColor(depth){
//     if (depth < 5) return "#ebd234";
//     else if (depth < 15) return "#b4eb34";
//     else if (depth < 30) return "#34eb8c";
//     else if (depth < 45) return "#34ebba";
//     else if (depth < 60) return "#349eeb";
//     else return "#eb3461";
// }


function Markers(feature, latlng){
    let choices = {
        radius : markerSize(feature.properties.mag),
        fillColor: depthColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: "black",
        stroke: true,
        weight: 0.7
    } 
    return L.circleMarker(latlng,choices);
}


