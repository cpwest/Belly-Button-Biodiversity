// Function that builds the metadata panel
function buildMetadata(sample) {
  console.log(sample);
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(response) {

    console.log(response);
    
    //   Use d3 to select the panel with id of `#sample-metadata`
    var meta_data = d3.select("#sample-metadata");
    
    //   Use `.html("") to clear any existing metadata
    meta_data.html("");

    //   Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(([key, value]) => {
      var listItem = meta_data.append("li");
      listItem.text(`${key}: ${value}`);
    });
  });
}


function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(response) {
    console.log(response);
    // Build a Bubble Chart using the sample data
    // Create Trace 
    var bubbleTrace = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: "markers",
      marker: {
        size: response.sample_values,
        color: response.otu_ids,
      },

      text: response.otu_labels,

    };
    var bubbleData = [bubbleTrace];
    var bubbleLayout = {
      // title: "<b>Sample Sizes</b>",
      showlegend: false,
      autosize: true,
      xaxis: {
        title: 'OTU ID'
        }
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout, {
      scrollZoom: true
    });

    // Build a Pie Chart
    // Slice "top ten"
  
    var pieData = [{
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      hovertext: response.otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: 'pie'
    }];
    
    var pieLayout = {
      height: 400,
      width: 500
    };
    
    Plotly.newPlot('pie', pieData, pieLayout);
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
