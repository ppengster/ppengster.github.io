zingchart.maps.loadGeoJSON({
  id: "california", // Give the map an id
  url: "zip.json", // GeoJSON object for CA
  style: {
    //Optional styling options
    poly: {
      label: {
        visible: false
      }
    }
  },
  callback: function() {
    // Function called when GeoJSON is loaded
    $.get("style.json", function(data) {
      var items = data; //style JSON generated from geoJSON && countyAvgs
      zingchart.render({
        id: "map",
        width: "100%",
        height: "480",
        data: {
          globals: {
            fontFamily: "Playfair Display"
          },
          title: {
            text:
              "Number of Incidents Are <strong>Negatively Correlated</strong> with the Income of a Neighborhood",
            "font-size": 16,
            "text-align": "right",
            "font-weight": "normal"
          },
          legend: {
            "toggle-action": "none",
            "vertical-align": "middle",
            align: "right",
            "border-width": 0,
            "background-color": "none",
            item: {
              "font-size": 16
            }
          },
          source: {
            text: "Source: City of San Diego Open Data Potral",
            url: "https://data.sandiego.gov/datasets/fire-incidents/",
            "text-align": "right"
          },
          subtitle: {
            y: 50,
            text: "Monthly Fire and Hazard Events <br> in San Diego, California",
            "text-align": "right",
            "font-weight": "normal"
          },
          shapes: [
            {
              type: "zingchart.maps", // Set shape to map type
              options: {
                name: "california", // Reference to the id set in loadGeoJSON()
                scale: true,
                style: {
                  items: items,
                  label: {
                    visible: false
                  },
                  controls: {
                    visible: false
                  }
                }, // Automatically scale to correct proportions
                zooming: false,
                panning: false,
                scrolling: false
              }
            }
          ],
          series: [
            // for legend items
            {
              "legend-item": {
                text: "None"
              },
              "legend-marker": {
                "background-color": "#DDDDDD"
              }
            },
            {
              "legend-item": {
                text: "1 - 25"
              },
              "legend-marker": {
                "background-color": "#FF9B54"
              }
            },
            {
              "legend-item": {
                text: "26 - 50"
              },
              "legend-marker": {
                "background-color": "#FF7F51"
              }
            },
            {
              "legend-item": {
                text: "51 - 75"
              },
              "legend-marker": {
                "background-color": "#CE4848"
              }
            },
            {
              "legend-item": {
                text: "75 - 100"
              },
              "legend-marker": {
                "background-color": "#720026"
              }
            },
            {
              "legend-item": {
                text: "100+"
              },
              "legend-marker": {
                "background-color": "#4F000B"
              }
            }
          ]
        }
      });
    });
  }
});

// Utility function to fetch any file from the server
function fetchJSONFile(filePath, callbackFunc) {
  console.debug("Fetching file:", filePath);
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200 || httpRequest.status === 0) {
              console.info("Loaded file:", filePath);
              var data = JSON.parse(httpRequest.responseText);
              console.debug("Data parsed into valid JSON!");
              console.debug(data);
              if (callbackFunc) callbackFunc(data);
          } else {
              console.error("Error while fetching file", filePath, 
                  "with error:", httpRequest.statusText);
          }
      }
  };
  httpRequest.open('GET', filePath);
  httpRequest.send();
}

data = "";
fetchJSONFile('data.json', function(d) {
  data = d;
});

valid_zips = ['92101', '92109', '92102', '92105', '92120', '92124', '92113', '92131', '92122', '92130', '92093', '92111', '92104', '92037', '92115', '92117', '92123', '92106', '92110', '92129', '92107', '92128', '92103', '92173', '92154', '92108', '92121', '92119', '92126', '92139', '92116', '92127', '92182', '92114', '92027', '92014', '92133', '92145', '91950', '91942', '91911', '92025', '92071', '92136', '92067', '92140', '91932', '92161', '92064', '92065', '92075', '91945', '91941', '92134', '92029'];

zip = {};
fetchJSONFile('zip.json', function(d) {
  zip = d;
});

income = {};
fetchJSONFile('income.json', function(d) {
  income = d;
});

fire_count = [436, 321, 382, 413, 385, 363, 415, 405, 368, 373, 405, 379, 404,
  296, 362, 329, 404, 382, 423, 409, 398, 395, 399, 376, 422, 371,
  373, 393, 441, 426, 489, 454, 520, 435, 420, 449, 486, 398, 387,
  386, 423, 479, 476, 513, 485, 446, 454, 456, 492, 368, 416, 414,
  471, 450, 420, 455, 444, 422, 440, 495, 524, 425, 441, 442, 589,
  425, 488, 467, 460, 429, 453, 413, 484, 384, 509, 448, 457, 433,
  496, 471, 445, 459, 414, 425, 464, 454, 488, 451, 438, 470, 526,
  497, 488, 493, 495, 495, 460, 395, 472, 486, 479, 522, 506, 477,
  506, 545, 513, 698, 559, 487, 478, 500, 479, 489, 564, 508, 512,
  496, 562, 482, 332, 323, 290, 352, 380, 397, 410, 431, 373, 491,
  393];

hazard_count = [ 812,  839,  801,  767,  771,  763,  897,  910,  835,  812,  723,
  903,  891,  643,  730,  778,  763,  764,  815,  787,  807,  931,
  799, 1024,  812,  752,  820,  793,  756,  732,  808,  879,  978,
  850,  867,  838,  735,  662,  766,  708,  718,  740,  785,  840,
  833,  925,  866,  891,  829,  637,  719,  691,  731,  819,  839,
  832,  910,  881,  795,  858,  816,  687,  831,  729,  824,  768,
  889,  913,  930,  898,  880,  983,  851,  684,  832,  772,  787,
  906,  926,  982,  962,  956,  921,  924, 1031,  843,  882,  799,
  729,  873,  860,  971,  963,  959,  933, 1052, 1037,  932,  828,
  817,  828,  942,  998,  997,  986, 1024,  974,  970,  975,  778,
  927,  784,  794,  803,  975, 1006,  874, 1085, 1147, 1061, 1022,
  930,  921,  861,  914,  910, 1057, 1061, 1024, 1097, 1112];

var myConfig = {
  type: "area",
  globals: {
    fontFamily: "Playfair Display"
  },
  arrows: [{
    backgroundColor:"white",
    alpha: 0.2,
    borderAlpha: 1,
    from:{
      hook:"node:plot=0,index=1"
    },
    to:{
      hook:"node:plot=0,index=118"
    }
  }],
  utc: true,
  plotarea: {
    margin: "dynamic 20 30 dynamic"
  },
  legend: {
    layout: "float",
    "background-color": "none",
    "border-width": 0,
    align: "center",
    "adjust-layout": true,
    "toggle-action": "remove",
    item: {
      padding: 7,
      cursor: "hand"
    }
  },
  "scale-x": {
    minValue: 1230768000000,
    step: 2592000000,
    transform: {
      type: "date",
      all: "%M '%y",
      "guide": {
          "visible": false
      },
      "item": {
          "visible": false
      }
    }
  },
  "scale-y": {
    "line-color": "#f6f7f8",
    "guide": {
      "line-style": "dashed"
    },
    label: {
      text: "Event Counts"
    }
  },
  "crosshair-x": {
    "line-color": "#efefef",
    "plot-label": {
      "border-radius": "5px",
      "border-width": "1px",
      "border-color": "#f6f7f8",
      padding: "10px",
      "font-weight": "bold"
    },
    "scale-label": {
      "font-color": "#000",
      "background-color": "#f6f7f8",
      "border-radius": "5px"
    }
  },
  "tooltip": {
    'visible': false
  },
  "plot": {
    aspect: "spline",
    stacked: true,
    "marker": {
      "type": null,
      "size": 1
    },
    "animation": {
      "effect": 4,
      "sequence": 4,
      "speed": 100
    }
  },
  series: [
    {
      values: fire_count,
      text: "FIRE",
      "line-color": "#ffa02f",
      "legend-item": {
        "background-color": "#ffa02f",
        borderRadius: 5,
        "font-color": "white"
      },
      "legend-marker": {
        visible: false
      },
      marker: {
        "background-color": "#ffa02f",
        "border-width": 1,
        shadow: 0,
        "border-color": "#ffa02f"
      },
      "highlight-marker": {
        size: 6,
        "background-color": "#ffa02f"
      }
    },
    {
      values: hazard_count,
      text: "HAZARD",
      "line-color": "#00c7b2",
      "legend-item": {
        "background-color": "#00c7b2",
        borderRadius: 5,
        "font-color": "white"
      },
      "legend-marker": {
        visible: false
      },
      marker: {
        "background-color": "#00c7b2",
        "border-width": 1,
        shadow: 0,
        "border-color": "#00c7b2"
      },
      "highlight-marker": {
        size: 6,
        "background-color": "#00c7b2"
      }
    }
  ]
};

zingchart.render({
  id: "line",
  data: myConfig,
  height: "200",
  width: "100%"
});

var myConfig = {
  type: 'bar',
  globals: {
    fontFamily: "Playfair Display"
  },
  plotarea: {
    'adjust-layout': true
  },
  'scale-y': {
    'min-value':0,
    'max-value':240000,
    format: "$%v",
    "thousands-separator":","
  },
  'scale-x': {
    label: {
      text: 'Income by ZIP'
    },
    labels: [ "Median", "Average", "Per-capita" ]
  },
  plot: {
    'value-box': {
      text: "$%v",
      'thousands-separator': ", "
    }
  },
  series: [
    { values: [0,0,0]}
  ]
};

zingchart.render({ 
	id : 'bar', 
	data : myConfig, 
	height: "500", 
	width: "100%" 
});

function onMouseoverChart(e) {
  to_update = data[e.items[0].nodeindex];

  for(i = 0; i < Object.keys(to_update).length; i++) {
    z = Object.keys(to_update)[i];
    if(!z in valid_zips) {
      continue
    }
    z_data = to_update[z];
    color = '';
    if(z_data == 0){
      color = '#DDDDDD';
    }
    else if(z_data < 26){
      color = '#FF9B54';
    }
    else if(z_data < 51){
      color = '#FF7F51';
    }
    else if(z_data < 76){
      color = '#CE4848';
    }
    else if(z_data < 101){
      color = '#720026';
    }
    else {
      color = '#4F000B';
    }
    console.log(z)
    if(document.getElementById('map-graph-id0-shape-' + z + '-gshape-path') != null) {
      document.getElementById('map-graph-id0-shape-' + z + '-gshape-path').setAttribute('fill', color);
    }
    
  }
  
}

function onMouseoverBar(e) {
  var myConfig = {
    type: 'bar',
    globals: {
      fontFamily: "Playfair Display"
    },
    plotarea: {
      'adjust-layout': true
    },
    'scale-y': {
      markers:[
        {
          type:"line",
          range: [73108.5],
          lineColor: "red",
          lineWidth: 2,
          label:{  //define label within marker
            text:"Median of All Neighborhood Income",
            backgroundColor:"white",
            alpha: 0.7,
            textAlpha: 1
          }
        }
      ]
      ,
      'min-value':0,
      'max-value':240000,
      format: "$%v",
      "thousands-separator":","
    },
    'plot': {
      "animation": {
        "effect": 4,
        "sequence": 4,
        "speed": 1
      },
      'value-box': {
         text: "$%v",
        'thousands-separator': ", "
      }
    },
    'scale-x': {
      label: {
        text: 'Income of ' + e.shapeid
      },
      labels: [ "Median", "Average", "Per-capita" ]
    },
    series: [
      {
        values: [parseInt(income['median'][e.shapeid]), parseInt(income['average'][e.shapeid]), parseInt(income['per_cap'][e.shapeid])], 
        'background-color': '#FF9B54'
      }
    ]
  };
  
  zingchart.render({ 
    id : 'bar', 
    data : myConfig, 
    height: "500", 
    width: "100%" 
  });
}
/*
Population from 2009 - 2019
2964000
2994000
3024000
3055000
3086000
3117000
3148000
3180000
3212000
3231000
*/

zingchart.bind("line", "guide_mousemove", onMouseoverChart);
zingchart.bind("map", "shape_mouseover", onMouseoverBar);

/*
zingchart.exec('myid', 'setseriesdata', {
  graphid: 0,
  plotindex: 1,
  data: {
    values: [10, 15, 20, ...],
    lineColor: 'red'
  }
});
*/

