// Create dropdown menu of ID numbers dynamically pulling from the names array
function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });
}
  
// Print information of the Demographic Info panel
function optionChanged(newSample) {
  buildMetadata(newSample);
  barChart(newSample);
  bubbleChart(newSample);
  
}

// Initialize the dashboard
init();

// Creating an event listener to refresh the page
d3.selectAll("body").on("change", updatePage);

function updatePage() {
  var dropdownMenu = d3.selectAll("#selectOption").node();

};

// Building the demographic information panel with a specific volunteer’s information.
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      console.log(result);
      var PANEL = d3.select("#sample-metadata");
      
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) =>{
      PANEL.append("h6").text(key.toUpperCase() + ': ' + value);});
    });
}; 



// Building a bar chart
function barChart(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var currentSample = resultArray[0];
      var otuids = currentSample.otu_ids;
      var otulabels = currentSample.otu_labels;
      var sample_values = currentSample.sample_values;
      var yticks = otuids.slice(0,10).map(otuid => `OTU${otuid}`).reverse()

      var barSamples = {
          x: sample_values.slice(0,10).reverse(),
          y: yticks,
          text: otulabels.slice(0,10).reverse(),
          type: "bar",
          orientation: "h"
      }
      //var data = [barSamples];

      var layout = {
        title: "Top 10 Species by Type (Found near Belly Button)",
        showlegend: false
        //xaxis: { title: "OTU ID"},
       // yaxis: { title: "Species Count"}
      };

      Plotly.newPlot("bar", [barSamples], layout);
    });
 }

//Creating a Gauge Chart
// function gaugeChart(sample) {
//   d3.json("samples.json").then((data) => {
//     var samples = data.samples;
//     var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
//     var currentSample = resultArray[0];
//     var otuids = currentSample.otu_ids;
//     var otulabels = currentSample.otu_labels;
//     var sample_values = currentSample.sample_values;

//     var gaugeSamples = {
//       title: { text: "Belly Button Washing Frequency" },
//       type: "indicator",
//      mode: "gauge+number+delta",
//      delta: { reference: 380 },
//      gauge: {
//        axis: { range: [null, 500] },
//        steps: [
//          { range: [0, 250], color: "lightgray" },
//          { range: [250, 400], color: "gray" }
//        ],
//        threshold: {
//          line: { color: "red", width: 4 },
//          thickness: 0.75,
//          value: 490
//     }
//   });
// }

// var data = [
//    {
//           value: 450,
//      title: { text: "Speed" },
//      type: "indicator",
//      mode: "gauge+number+delta",
//     delta: { reference: 380 },
//      gauge: {
//        axis: { range: [null, 500] },
//        steps: [
//          { range: [0, 250], color: "lightgray" },
//          { range: [250, 400], color: "gray" }
//        ],
//        threshold: {
//          line: { color: "red", width: 4 },
//          thickness: 0.75,
//          value: 490
//        }
//      }
//    }
//  ];
  
//  var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
//  Plotly.newPlot('gauge', [gaugeSamples], layout);

//Creating a bubble chart
 function bubbleChart(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var currentSample = resultArray[0];
      var otuids = currentSample.otu_ids;
      var otulabels = currentSample.otu_labels;
      var sample_values = currentSample.sample_values;

      var bubbleSamples = {
          x: sample_values,
          y: otuids,
          text: otulabels,
          type: "bubble",
          mode: 'markers',
          marker: {
              color: otuids,
              colorscale: 'Earth',
              size: sample_values
          }
      };

      var layout = {
        title: "Count of Species by Type (Found near Belly Button)",
        showlegend: false,
        xaxis: { title: "OTU ID"},
        yaxis: { title: "Species Count"}
      };

      Plotly.newPlot("bubble", [bubbleSamples], layout);
    });
}
// Create charts
function buildCharts(newsample) {
  barChart(newsample);
  //gaugeChart(newsample);
  bubbleChart(newsample);
}
 
