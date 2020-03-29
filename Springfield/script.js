/*
The purpose of this demo is to demonstrate how multiple charts on the same page
can be linked through DOM and Highcharts events and API methods. It takes a
standard Highcharts config with a small variation for each data set, and a
mouse/touch event handler to bind the charts together.
*/

/**
 * https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/synchronized-charts/
 *
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */

["mousemove", "touchmove", "touchstart"].forEach(function(eventType) {
  document.getElementById("container").addEventListener(eventType, function(e) {
    var chart, point, i, event;

    for (i = 0; i < Highcharts.charts.length; i = i + 1) {
      chart = Highcharts.charts[i];
      // Find coordinates within the chart
      event = chart.pointer.normalize(e);
      // Get the hovered point
      point = chart.series[0].searchPoint(event, true);

      if (point) {
        //updating pie chart
        data = [];
        sum = 0;

        //updating list
        //first by delete all rows
        while (document.getElementById("iamlist").rows.length > 1) {
          document.getElementById("iamlist").deleteRow(1);
        }
        for (j = 0; j < sources.length; j++) {
          sum += sources[j].data[ticks.indexOf(point.x)][1];
        }
        var row = document.getElementById("iamlist").insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.align = "right";
        cell2.align = "right";
        cell3.align = "right";
        cell4.align = "right";
        cell1.innerHTML = "Sources";
        cell2.innerHTML = sum.toFixed(2);
        cell3.innerHTML = "-";
        cell4.innerHTML = "-";
        
        for (j = 0; j < sources.length; j++) {
          slice = new Object();
          slice["y"] = sources[j].data[ticks.indexOf(point.x)][1];
          slice["name"] = sources[j].name;
          slice["color"] = sources[j].color;
          data.push(slice);

          var row = document.getElementById("iamlist").insertRow(-1);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          cell1.align = "right";
          cell2.align = "right";
          cell3.align = "right";
          cell4.align = "right";
          cell1.innerHTML = "<font color=" + slice['color'] + ">\u25A0</font>" + slice['name'];
          cell2.innerHTML = slice['y'].toFixed(2);
          cell3.innerHTML = (slice['y']/sum*100).toFixed(2) + "%";
          cell4.innerHTML = "-";
        }
        Highcharts.charts[3].series[0].setData(data);
        sum_text = sum.toString();
        if (sum_text.indexOf(".") != -1) {
          sum_text = sum_text.slice(0, sum_text.indexOf("."));
        }
        if (sum_text.length > 3) {
          sum_text = sum_text[0] + "," + sum_text.slice(1);
        }
        Highcharts.charts[3].setTitle({
          verticalAlign: "middle",
          floating: true,
          style: { fontSize: 15 },
          text: "<b>" + sum_text + " MW</b>"
        });

        sub = 0;
        for (j = others.length-1; j > 2; j--) {
          sub += others[j].data[ticks.indexOf(point.x)][1];
        }
        var row = document.getElementById("iamlist").insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.align = "right";
        cell2.align = "right";
        cell3.align = "right";
        cell4.align = "right";
        cell1.innerHTML = "Loads";
        cell2.innerHTML = sub.toFixed(2);
        cell3.innerHTML = "-";
        cell4.innerHTML = "-";

        for (j = others.length-1; j > 2; j--) {
          slice = new Object();
          slice["y"] = others[j].data[ticks.indexOf(point.x)][1];
          slice["name"] = others[j].name;
          slice["color"] = others[j].color;
          data.push(slice);

          var row = document.getElementById("iamlist").insertRow(-1);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          cell1.align = "right";
          cell2.align = "right";
          cell3.align = "right";
          cell4.align = "right";
          cell1.innerHTML = "<font color=" + slice['color'] + ">\u25A0</font>" + slice['name'];
          cell2.innerHTML = slice['y'].toFixed(2);
          cell3.innerHTML = Math.abs(slice['y']/sub*100).toFixed(2) + "%";
          cell4.innerHTML = "-";
        }
        point.highlight(e);
      }
    }
  });
});

/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function() {
  return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function(event) {
  event = this.series.chart.pointer.normalize(event);
  // this.onMouseOver(); // Show the hover marker
  //console.log(this.series);

  this.series.chart.tooltip.refresh(this); // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
  var thisChart = this.chart;

  if (e.trigger !== "syncExtremes") {
    // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function(chart) {
      if (chart !== thisChart) {
        if (chart.xAxis[0].setExtremes) {
          // It is null while updating
          chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
            trigger: "syncExtremes"
          });
        }
      }
    });
  }
}

var colors = {
  black_coal: "#0F0D0F",
  distillate: "#E73516",
  gas_ccgt: "#F9A44A",
  hydro: "#3A70A9",
  wind: "#396400",
  exports: "#8664a6",
  pumps: "#7b9fc9"
};

function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200 || httpRequest.status === 0) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open("GET", path);
  httpRequest.send();
}

beginning_unix = 1571580000;
end_unix = 1572181200;
ticks = [];
for (i = beginning_unix; i <= end_unix; i += 1800) {
  ticks.push(i);
}
//console.log(ticks);

sources = []; //fuel_tech
others = []; //exports, pumps, demand

fetchJSONFile("springfield_converted.json", function(activity) {
  // preparing data
  for (i = 0; i < activity.length; i++) {
    dataset = activity[i];
    //console.log(dataset);

    ds = new Object();
    ds["showInLegend"] = false;
    ds["fillOpacity"] = 100;
    ds["tooltip"] = {
      valueSuffix: " MW"
    };

    if (dataset.type == "power") {
      // power
      ds["name"] = dataset.fuel_tech;
      ds["type"] = "area";
      if (dataset.fuel_tech == "rooftop_solar") {
        //ditching the solar data
        continue;
      }
      ds["color"] = colors[dataset.fuel_tech];

      if (dataset.fuel_tech == "exports" || dataset.fuel_tech == "pumps") {
        //exports and pumps (negative)
        ds["data"] = [];
        for (j = 0; j < dataset.history.data.length; j++) {
          if (ticks.indexOf(dataset.history.start) != -1) {
            res = [dataset.history.start, dataset.history.data[j] * -1];
            ds["data"].push(res);
          }
          dataset.history.start += parseInt(
            dataset.history.interval.slice(0, -1) * 60
          );
        }

        others.unshift(ds);
      } else {
        ds["data"] = [];
        for (j = 0; j < dataset.history.data.length; j++) {
          if (ticks.indexOf(dataset.history.start) != -1) {
            res = [dataset.history.start, dataset.history.data[j]];
            ds["data"].push(res);
          }
          dataset.history.start += parseInt(
            dataset.history.interval.slice(0, -1) * 60
          );
        }

        sources.unshift(ds);
      }
    } else {
      // not power

      ds["color"] = "#b62d18";
      ds["name"] = dataset.type;
      // demand
      ds["data"] = Highcharts.map(dataset.history.data, function(val, j) {
        res = [dataset.history.start, val];
        dataset.history.start += 1800;
        return res;
      });

      others.unshift(ds);
    }
  }

  Highcharts.setOptions({
    chart: {
      style: {
        fontFamily: "Playfair Display",
        color: "#333"
      }
    }
  });

  // setting up chart
  var chartDiv = document.createElement("div");
  chartDiv.className = "chart";
  chartDiv.style =
    "height:50%; width:70%; position: absolute; top: 0; bottom: 0; left: 0; right: 0;";
  document.getElementById("container").appendChild(chartDiv);

  Highcharts.chart(chartDiv, {
    chart: {
      backgroundColor: "#ece9e6",
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20
    },
    title: {
      text: "Energy of Springfield",
      align: "left",
      margin: 0,
      x: 30,
      y: 5
    },
    xAxis: {
      tickInterval: 86400,
      crosshair: {
        color: "#b62d18"
      },
      events: {
        setExtremes: syncExtremes
      },
      labels: {
        formatter: function() {
          return Highcharts.dateFormat("%a<br>%b %e", this.value * 1000);
        },
        style: {
          fontFamily: "IBM Plex Serif"
        }
      }
    },
    yAxis: {
      title: {
        text: null
      },
      labels: {
        style: {
          fontFamily: "IBM Plex Serif"
        }
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      positioner: function() {
        return { x: this.chart.chartWidth - this.label.width, y: 10 };
      },
      borderWidth: 0,
      shadow: false,
      pointFormatter: function() {
        return (
          "<b>" +
          Highcharts.dateFormat("%e %b, %l:%M %p", this.x * 1000) +
          "</b> "
        );
      },
      valueDecimals: 2,
      headerFormat: ""
    },
    plotOptions: {
      series: {
        stacking: "normal",
        states: {
          hover: {
            enabled: false
          }
        }
      }
    },
    series: sources
  });

  // setting up chart
  var chartDiv = document.createElement("div");
  chartDiv.className = "chart";
  chartDiv.style =
    "height:25%; width:70%; position: absolute; top: 50%; bottom: 0; left: 0; right: 0;";
  document.getElementById("container").appendChild(chartDiv);

  Highcharts.chart(chartDiv, {
    chart: {
      backgroundColor: "#ece9e6",
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20
    },
    title: {
      text: "<b>Price</b> $/MWh",
      align: "left",
      style: { fontSize: 12 },
      margin: 0,
      x: 30,
      y: 0
    },
    xAxis: {
      tickInterval: 999999999,
      crosshair: {
        color: "#b62d18"
      },
      events: {
        setExtremes: syncExtremes
      },
      labels: {
        formatter: function() {
          return Highcharts.dateFormat("%a<br>%b %e", this.value * 1000);
        },
        style: {
          fontFamily: "IBM Plex Serif"
        }
      }
    },
    yAxis: {
      title: {
        text: null
      },
      labels: {
        style: {
          fontFamily: "IBM Plex Serif"
        }
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      positioner: function() {
        return { x: this.chart.chartWidth - this.label.width, y: 10 };
      },
      borderWidth: 0,
      shadow: false,
      pointFormatter: function() {
        return (
          "<b>" +
          Highcharts.dateFormat("%e %b, %l:%M %p", this.x * 1000) +
          "</b> <b> $" +
          this.y +
          ".00 </b> "
        );
      },
      headerFormat: ""
    },
    plotOptions: {
      series: {
        stacking: "normal",
        states: {
          hover: {
            enabled: false
          }
        }
      }
    },
    series: others.slice(2, 3)
  });

  // setting up chart
  var chartDiv = document.createElement("div");
  chartDiv.className = "chart";
  chartDiv.style =
    "height:25%; width:70%; position: absolute; top: 75%; bottom: 0; left: 0; right: 0;";
  document.getElementById("container").appendChild(chartDiv);

  Highcharts.chart(chartDiv, {
    chart: {
      backgroundColor: "#ece9e6",
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20
    },
    title: {
      text: "<b>Temperature</b> °F",
      align: "left",
      style: { fontSize: 12 },
      margin: 0,
      x: 30,
      y: 0
    },
    xAxis: {
      tickInterval: 999999999,
      crosshair: {
        color: "#b62d18"
      },
      events: {
        setExtremes: syncExtremes
      },
      labels: {
        formatter: function() {
          return Highcharts.dateFormat("%a<br>%b %e", this.value * 1000);
        },
        style: {
          fontFamily: "IBM Plex Serif",
          fontSize: 0
        }
      }
    },
    yAxis: {
      title: {
        text: null
      },
      labels: {
        style: {
          fontFamily: "IBM Plex Serif"
        }
      }
    },
    tooltip: {
      positioner: function() {
        return { x: this.chart.chartWidth - this.label.width, y: 10 };
      },
      borderWidth: 0,
      shadow: false,
      pointFormatter: function() {
        return (
          "<b>" +
          Highcharts.dateFormat("%e %b, %l:%M %p", this.x * 1000) +
          "</b> Av <b> " +
          this.y +
          "°F </b> "
        );
      },
      headerFormat: ""
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        stacking: "normal",
        states: {
          hover: {
            enabled: false
          }
        }
      }
    },
    series: others.slice(0, 1)
  });

  // setting up chart
  var chartDiv = document.createElement("div");
  chartDiv.className = "chart";
  chartDiv.id = "pie";
  chartDiv.style =
    "height:50%; width:30%; position: absolute; top: 50%; bottom: 0; left: 70%; right: 0;";
  document.getElementById("container").appendChild(chartDiv);

  Highcharts.chart(chartDiv, {
    chart: {
      backgroundColor: "#ece9e6",
      fontFamily: "IBM Plex Serif",
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20,
      type: "pie"
    },
    tooltip: {
      enabled: false
    },
    title: {
      verticalAlign: "middle",
      floating: true,
      style: { fontSize: 15 },
      text: "<b>N/A</b>"
    },
    plotOptions: {
      pie: {
        innerSize: "50%",
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false
        }
      }
    },
    series: [
      {
        data: {
          y: 100,
          name: "Peter",
          color: "#000000"
        }
      }
    ],
    credits: false
  });

  Highcharts.charts[0].renderer
    .image(
      "https://cdn4.iconfinder.com/data/icons/smashicons-movies-flat/60/50_-_Homer_Flat-512.png",
      5,
      5,
      30,
      30
    )
    .add();
});
