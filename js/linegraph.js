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

    selected_types = ["1", "2", "2P", "3", "4", "5", "6"];

    var offsets = [35, 25];

    // color scale
    var linecolors = d3.scaleOrdinal()
        .domain(car_types)
        .range(['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d']);

    // create field
    var svg = d3.select("#linegraph")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    var linegraph = svg
        .append("g")
        .attr("transform", "translate(" + offsets[0] + ", " + -offsets[1] + ")");

    // x and y scales
    var x = d3.scaleLinear()
            .domain([0, dates.length - 1])
            .range([0, w - offsets[0]]),
        y = d3.scaleLinear()
            .range([h, offsets[0]]);

    // create axes
    var xAxis = d3.axisBottom(x)
            .ticks(10)
            .tickPadding(8)
            .tickFormat(function(i, d) {
                return dates[i];
            }),
        yAxis = d3.axisLeft(y)
            .ticks(0)
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

    linegraph.append("text")
        .text("Date")
        .attr("class", "axis-label")
        .attr("x", w - offsets[0])
        .attr("y", h + offsets[1]);

    linegraph.append("text")
        .text("# visitors")
        .attr("class", "axis-label")
        .attr("x", -30)
        .attr("y", -27)
        .attr("transform", "rotate(-90)");

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

            // calculate number of ticks (max 5)
            var tickcount = 5;
            if (Math.max(...vals) < 5) {
                tickcount = Math.max(...vals);
            }

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
            yAxis.ticks(tickcount);
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
                    .text(": " + val);
            });
        }
    });

    $("#linegraph input")
        .on("click", function() {

            var type = this.value.replace("#type-", ""),
                index = selected_types.indexOf(type);

            // check if checkbox is checked, display accordingly
            // also remove/add car types from table
            if (this.checked === true) {
                d3.select(this.value).attr("display", "true");
                selected_types.push(type);
            }
            else {
                d3.select(this.value).attr("display", "none");
                selected_types.splice(index, 1);
            }

            $("#linegraph").trigger("update");
            $("table").trigger("renew");


        });
});
