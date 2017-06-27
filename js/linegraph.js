/**
 * Name: Sven van Dam
 * Student number: 10529772
 * Programmeerproject
 * VAST Challenge 2017
 */

// make dates global
var dates;

// load all dates
d3.json("data/dates.json", function(error, data) {
    if (error) throw error;

    dates = data.array;
    d3.select("#datetext").text(dates[0]);
});


d3.json("data/path_busyness.json", function(error, data) {

    if (error) throw error;

    // types of vehicles
    var car_types = ["1", "2", "2P", "3", "4", "5", "6"];

    // color scale
    var linecolors = d3.scaleOrdinal()
        .domain(car_types)
        .range(['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d']);

    var w = window.innerWidth * 0.45,
        h = window.innerHeight * 0.45;

    // create field
    var svg = d3.select("#linegraph")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    var linegraph = svg
        .append("g")
        .attr("transform", "translate(25, -25)");

    // x and y scales
    var x = d3.scaleLinear()
            .domain([0, dates.length - 1])
            .range([5, w - 5])
            .nice(),
        y = d3.scaleLinear()
            .range([h - 5, 30]);

    // create axes
    var xAxis = d3.axisBottom(x)
            .ticks(10)
            .tickPadding(8)
            .tickFormat(function(i, d) {
                return dates[i];
            }),
        yAxis = d3.axisLeft(y)
            .ticks(5)
            .tickPadding(8)
            .tickFormat(d3.format(".0f"));

    // create groups for axes and call them
    var gX = linegraph.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0, " + h + ")")
            .call(xAxis),
        gY = linegraph.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

    // add line for each car type
    car_types.forEach(function(type) {
        linegraph.append("path")
            .attr("id", "type-" + type)
            .attr("class", "typeline")
            .style("fill", "none");
    });

    // color checkboxes to make them function as legend
    d3.selectAll("li")
        .data(car_types)
        .style("background" , function(d) { return linecolors(d); });

    // create vertical line which moves over the graph
    var ruler = linegraph.append("line")
        .attr("id", "ruler")
        .attr("class", "ruler")
        .attr("y1", y(0))
        .attr("y2", y(h))
        .attr("stroke", "#333333")
        .attr("stroke-width", "2");

    // line function for path
    var line = d3.line()
        .x(function(d) { return x(d.x); });


    $("#linegraph").on("update", function() {
        if (selected_edge) {
            var vals = [];

            // get data based on selected edge in graph
            var pathdata = data[selected_edge];

            // filter deselected types
            pathdata.forEach(function(d) {
                car_types.forEach(function(type) {
                    if (d3.select("#check-" + type).property("checked") === true) {
                        vals.push(d[type]);
                    }
                });
            });

            // determine y-domain
            y.domain([Math.min(...vals), Math.max(...vals)]);

            // update line function and draw path for eacht car type
            car_types.forEach(function(variable) {
                line
                    .y(function(d) { return y(d[variable]); });

                d3.select("#type-" + variable)
                    .transition().duration(300)
                    .attr("stroke", linecolors(variable))
                    .attr("d", function(d){
                        return line(pathdata);
                    });
            });

            // update y-axis
            gY
                .transition().duration(150)
                .call(yAxis);
        }
    });

    $("#ruler").on("update", function() {
        if (selected_edge) {

            // read slider value and determine x position of ruler
            var x_val = d3.select("#slider").property("value"),
                x_pos = x(x_val);

            // update position
            ruler
                .attr("x1", x_pos)
                .attr("x2", x_pos);

            // update displayed values in legend
            var pathdata = data[selected_edge];
            car_types.forEach(function(variable) {
                var val = pathdata[parseInt(x_val)][variable];
                d3.select("#val-" + variable)
                    .text(val);
            });
        }
    });

    $("#linegraph input")
        .on("click", function() {

            // check if checkbox is checked, display accordingly
            if (this.checked === true) {
                d3.select(this.value).attr("display", "true");
            }
            else {
                d3.select(this.value).attr("display", "none");
            }

            $("#linegraph").trigger("update");
        });
});
