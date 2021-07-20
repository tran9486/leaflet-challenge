// Create map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Choose marker color based on depth
function chooseColor(depth){
    if (depth < 10){
        return "green"
    }
    else if ((depth >= 10) && (depth < 30)){
        return "greenyellow"
    }
    else if ((depth >= 30) && (depth < 50)){
        return "yellow"
    }
    else if ((depth >= 50) && (depth < 70)){
        return "orange"
    }
    else if ((depth >= 70) && (depth < 90)){
        return "orangered"
    }
    else {
        return "red"
    }
}

// Json data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grab Json data
d3.json(url).then(function(data){
    // Loop through data
    for (var i = 0; i < data.features.length; i++) {
        var feat = data.features[i]

        feat.geometry.coordinates[0] = +feat.geometry.coordinates[0]
        feat.geometry.coordinates[1] = +feat.geometry.coordinates[1]
        feat.geometry.coordinates[2] = +feat.geometry.coordinates[2]
        feat.properties.mag = +feat.properties.mag

        L.circle([feat.geometry.coordinates[1], feat.geometry.coordinates[0]],{
            color: chooseColor(feat.geometry.coordinates[2]),
            fillColor: chooseColor(feat.geometry.coordinates[2]),
            fillOpacity: 1,
            radius: feat.properties.mag*10000
        }).bindPopup(`<h2>${feat.properties.title}</h2>
            <hr>Type: ${feat.properties.type}
            <br>Location: ${feat.properties.place}
            <br>Coordinates: ${feat.geometry.coordinates[1]}, ${feat.geometry.coordinates[0]}
            <br>Depth: ${feat.geometry.coordinates[2]}
            <br>Magnitude: ${feat.properties.mag}`).addTo(myMap)
    }
    
    // Create legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ["<10","10-30","30-50","50-70","70-90","90+"];
        var colors = ['green','greenyellow','yellow','orange','orangered','red'];
        var labels = [];

    // Add min & max
        var legendInfo = "<h1>Depth</h1>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\">" + limits[index] + "</li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    legend.addTo(myMap);
})