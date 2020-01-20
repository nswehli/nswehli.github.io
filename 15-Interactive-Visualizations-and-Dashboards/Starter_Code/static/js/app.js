d3.json("samples.json").then(function (Data) {
    console.log(Data)
    var samples = Data.samples
    var subjectID = (Data.names)
    var metadata = Data.metadata


    d3.selectAll("#selDataset").on("change", selection);

    //setting the initial graph and filter

    var initial = subjectID[0]
    function search(id) {
        return id.id == initial;
    }
    console.log("Entered value is: " + initial);
    var results = samples.filter(search);

    //extracting the x and y values

    var xdata = (results[0].otu_ids).slice(0, 10)
    var y = (results[0].sample_values).slice(0, 10)
    var text = (results[0].otu_labels).slice(0, 10)

    var x = []

    //creating x-axis labels

    for (i = 0; i < 10; i++) {
        x.push(`OTU ${xdata[i]}`);
    }

    //creating the bar graph

    var data = [
        {
            x: x,
            y: y,
            text: text,
            type: 'bar',
            marker: {
                color: 'rgba(58,200,225,.5)',
                line: {
                    color: 'rgb(8,48,107)',
                    width: 1.5
                },
            }
        }
    ];
    Plotly.newPlot('bar', data);

    var x_bubble = (results[0].otu_ids)
    var y_bubble = (results[0].sample_values)
    var text_bubble = (results[0].otu_labels)
    var color = x_bubble
    //creating the bubble graph

    var bdata = [
        {
            x: x_bubble,
            y: y_bubble,
            text: text_bubble,
            mode: 'markers',
            marker: {
                color: color,
                size: y
            },
        }
    ];
    Plotly.newPlot('bubble', bdata);





    //filing the options in the dropdown menu
    var subjectFilter = d3.select("#selDataset")

    subjectID.forEach(item => {
        var row = subjectFilter.append("option")
        row.append("option").text(item);
    });

    //Creating Demographic data table
    var demo = d3.select("#sample-metadata")
    var demoData = metadata.filter(search)
    console.log("Demographics", demoData[0]);
    var demographics = demoData[0];

    var row = demo.append("ul")
    row.append("li").text(`Id: ${demographics.id}`);
    row.append("li").text(`Ethnicity: ${demographics.ethnicity}`);
    row.append("li").text(`Gender: ${demographics.gender}`);
    row.append("li").text(`Age: ${demographics.age}`);
    row.append("li").text(`Location: ${demographics.location}`);
    row.append("li").text(`bbtype: ${demographics.bbtype}`);
    row.append("li").text(`wfreq: ${demographics.wfreq}`);

    //creating the gauge indicator

    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: demographics.wfreq,
            title: { text: "Wash Frequency" },
            type: "indicator",
            mode: "number+gauge",
            gauge: { axis: { range: [null, 9] } }
        }
    ];

    // var layout = { width: 600, height: 400 };
    Plotly.newPlot('gauge', data);


    //creating event listener to the dropdown menu
    function selection() {
        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        var dataset = dropdownMenu.property("value");

        searchid = dataset
        var samples = Data.samples
        function search(id) {
            return id.id == searchid;
        }
        console.log("Selected value is: " + searchid);
        var results = samples.filter(search);
        var subjectID = (Data.names)
        //extracting the x and y values

        var xdata = (results[0].otu_ids).slice(0, 10)
        var y = (results[0].sample_values).slice(0, 10)
        var text = (results[0].otu_labels).slice(0, 10)

        var x = []

        //creating x-axis labels

        for (i = 0; i < 10; i++) {
            x.push(`OTU ${xdata[i]}`);
        }

        var bubbleUpdate = {
            'marker.color': [xdata],
            'x': [x],
            "y": [y]
        }
        Plotly.restyle("bubble", bubbleUpdate);


        Plotly.restyle("bar", "x", [x]);
        Plotly.restyle("bar", "y", [y]);



        //update demographic data

        //updating Demographic data table
        d3.select("#sample-metadata").selectAll("ul").remove()
        var demo = d3.select("#sample-metadata")
        var demoData = metadata.filter(search)
        var demographics = demoData[0];
        var row = demo.append("ul")
        row.append("li").text(`Id: ${demographics.id}`);
        row.append("li").text(`Ethnicity: ${demographics.ethnicity}`);
        row.append("li").text(`Gender: ${demographics.gender}`);
        row.append("li").text(`Age: ${demographics.age}`);
        row.append("li").text(`Location: ${demographics.location}`);
        row.append("li").text(`bbtype: ${demographics.bbtype}`);
        row.append("li").text(`wfreq: ${demographics.wfreq}`);

        //updating the Gauge
        Plotly.restyle("gauge", "value", [demographics.wfreq]);
    }

})

