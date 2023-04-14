// Creating the map object
let usgsMap = L.map("map", {
    center: [40, -110],
    zoom: 5.25
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(usgsMap);

// USGS endpoint
const usgsLink = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// GET request for endpoint
d3.json(usgsLink).then(function(data) {
    
    function getValue(x) {
        return x > 90 ? "#F06A6A" :
               x > 70 ? "#F0A76A" :
               x > 50 ? "#F3B94C" :
               x > 30 ? "#F3DB4C" :
               x > 10 ? "#E1F34C" :
                        "#B6F34C";
    }
    
    // Function for magnitude of the earthquake by their size and and the depth of the earthquake by color 
    function style(feature) {
        return {
            stroke: true,
            radius: feature.properties.mag * 4,
            fillColor: getValue(feature.geometry.coordinates[2]),
            color: "black",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.8
        };
    }
    
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },

        // Popups that provide additional information about the earthquake when its associated marker is clicked
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />Magnitude: " +
              feature.properties.mag + "<br /><br />Depth: " + feature.geometry.coordinates[2]+ 
              "<br /><br />Coordinates: " + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0]);
          }
    }).addTo(usgsMap);

    // Legend 
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let limits = [-10, 10, 30, 50, 70, 90];
      let colors = ['#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A']
      
  
      limits.forEach(function(limit, index) {
        div.innerHTML +=
      "<i style='background: " + colors[index] + "'></i> " +
      limits[index] + (limits[index + 1] ? "&ndash;" + limits[index + 1] + "<br>" : "+");
      });
        
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(usgsMap);

});








