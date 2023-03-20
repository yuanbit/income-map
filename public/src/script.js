require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/WebMap",
    "esri/config"
  ], function (esriConfig, Map, MapView, FeatureLayer, Legend, WebMap, esriConfig) {
    fetch('/api-key')
    .then(response => response.text())
    .then(apiKey => {
      esriConfig.apiKey = apiKey;
    });
  
    const basicLayer = new FeatureLayer({
      url: "https://services1.arcgis.com/aj3aipVBpIl0LroJ/arcgis/rest/services/2020basic/FeatureServer/0",
      opacity: 0.75,
    });
  
    const marriedLayer = new FeatureLayer({
      url: "https://services1.arcgis.com/aj3aipVBpIl0LroJ/arcgis/rest/services/2020marriedshape/FeatureServer/0",
      visible: false,
      opacity: 0.75,
    });
  
    const map = new Map({
      basemap: "arcgis-dark-gray",
      layers: [basicLayer, marriedLayer],
    });
  
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [8.5417, 47.3769],
      zoom: 13,
    });
  
    // Add the layers to the map
    map.add(basicLayer);
    map.add(marriedLayer);
  
    // Create dropdown menu
    const layerSelect = document.createElement("select");
    layerSelect.setAttribute("id", "layer-select");
  
    const basicOption = document.createElement("option");
    basicOption.setAttribute("value", "basic");
    basicOption.innerText = "Single";
    layerSelect.appendChild(basicOption);
  
    const marriedOption = document.createElement("option");
    marriedOption.setAttribute("value", "married");
    marriedOption.innerText = "Married";
    layerSelect.appendChild(marriedOption);
  
    // Add dropdown menu to view
    const container = document.createElement("div");
    container.setAttribute("class", "esri-widget");
    const maritalStatusText = document.createElement("span");
    maritalStatusText.innerText = "Marital Status: ";
    maritalStatusText.style.color = "#fff";
    container.appendChild(maritalStatusText);
    container.appendChild(layerSelect);
    view.ui.add(container, "top-right");
  
    // Set up event listener for dropdown change
    layerSelect.addEventListener("change", function (event) {
      const selectedLayer = event.target.value;
      switchLayer(selectedLayer);
    });
  
    // Add CSS styles to the dropdown menu
container.style.backgroundColor = "#252525";
container.style.paddingLeft = "24px";
container.style.paddingRight = "24px";
container.style.paddingTop = "8px";
container.style.paddingBottom = "8px";
container.style.borderRadius = "5px";
layerSelect.style.color = "#fff";
layerSelect.style.backgroundColor = "#252525";
maritalStatusText.style.paddingRight = "18px";
layerSelect.style.paddingRight = "75px";



const basicRender = {
  type: "simple",
  symbol: {
    type: "simple-fill",
    outline: {
      color: "#f6eff7",
      width: 1
    }, 
  },
  visualVariables: [{
    type: "color",
    field: "F2020_Grundtarif_SteuerEinkomme",
    stops: [{
        value: 30,
        color: "#f6eff7",
        label: "30,000-40,000"
        
      },
      {
        value: 40,
        color: "#bdc9e1",
        label: "40,001-50,000"
      },
      {
        value: 50,
        color: "#67a9cf",
        label: "50,001-60,000"
      },
      {
        value: 60,
        color: "#02818a",
        label: ">60,000"
      }
    ]
  }]
};




const marriedRender = {
  type: "simple",
  symbol: {
    type: "simple-fill",
    outline: {
      color: "#88419d",
      width: 1
    }, 
  },
  label: "Income",
  visualVariables: [{
    type: "color",
    field: "F2020_married_SteuerEinkommen_p",
    stops: [{
        value: 60,
        color: "#edf8fb",
        label: "60,000-85,000"
      },
      {
        value: 85,
        color: "#b3cde3",
        label: "85,001-110,000"
      },
      {
        value: 110,
        color: "#8c96c6",
        label: "110,001-160,000"
      },
      {
        value: 160,
        color: "#88419d",
        label: ">60,000"
      }
    ]
  }]
};

basicLayer.renderer = basicRender;
marriedLayer.renderer = marriedRender;

const legend = new Legend({
  view: view,
  layerInfos: [
    {
      layer: basicLayer,
      title: "Median Income",
      field: "F2020_Grundtarif_SteuerEinkomme",
      visible: true,
      
    },
    {
      layer: marriedLayer,
      title: "Median Income",
      field: "F2020_married_SteuerEinkommen_1",
      visible: false
    }
  ]
});

view.ui.add(legend, "bottom-right");

function switchLayer(layer) {
  if (layer === "basic") {
    marriedLayer.visible = false;
    basicLayer.visible = true;
    legend.layerInfos[0].visible = true;
    legend.layerInfos[1].visible = false;
  } else if (layer === "married") {
    basicLayer.visible = false;
    marriedLayer.visible = true;
    legend.layerInfos[0].visible = false;
    legend.layerInfos[1].visible = true;
  }
}


 // Set up a listener for the click event on the boundary layer
view.on("click", function(event) {
  view.hitTest(event).then(function(response) {
    const feature = response.results[0].graphic;
    if (feature) {
      const query = basicLayer.createQuery();
      query.geometry = event.mapPoint;
      basicLayer.queryFeatures(query).then(function(response) {
        const attributes = response.features[0].attributes;

        // Set up the popup for the boundary layer
        const popupTemplate = {
          title: "{bezeichnun}",
          content: "Median Income: " + Math.round(attributes.F2020_Grundtarif_SteuerEinkomme*1000).toLocaleString('en', {maximumFractionDigits: 0}) + " CHF",
        };
        basicLayer.popupTemplate = popupTemplate;
      });
    }
  });
});

 // Set up a listener for the click event on the boundary layer
 view.on("click", function(event) {
  view.hitTest(event).then(function(response) {
    const feature = response.results[0].graphic;
    if (feature) {
      const query = marriedLayer.createQuery();
      query.geometry = event.mapPoint;
      marriedLayer.queryFeatures(query).then(function(response) {
        const attributes = response.features[0].attributes;

        // Set up the popup for the boundary layer
        const popupTemplate = {
          title: "{bezeichnun}",
          content: "Median Income: " + Math.round(attributes.F2020_married_SteuerEinkommen_1*1000).toLocaleString('en', {maximumFractionDigits: 0}) + " CHF",
        };
        marriedLayer.popupTemplate = popupTemplate;
      });
    }
  });
});









// const query = marriedLayer.createQuery();
// query.where = "1=1"; // empty where clause
// query.outFields = ["*"]; // set outFields to '*'

// marriedLayer.queryFeatures(query).then(function(result) {
//   result.features.forEach(function(feature) {
//     console.log(feature.attributes);
//   });
// }).catch(function(error) {
//   console.error(error);
// });


});
