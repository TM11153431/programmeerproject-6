d3.json("../data/path_busyness.json", function(error, data) {

    if (error) throw error;


    var car_types = ["1", "2", "2P", "3", "4", "5", "6"];

    var linecolors = d3.scaleOrdinal()
        .domain(car_types)
        .range(['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d']);

    var w = window.innerWidth * 0.5,
        h = window.innerHeight * 0.5;

    var svg = d3.select("#linegraph")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    var linegraph = svg
        .append("g");

    var x = d3.scaleLinear()
            .domain([0, 397])
            .range([5, w - 5]),
        y = d3.scaleLinear()
            .range([h - 5, 5]);

    var zoomer = d3.zoom()
        .scaleExtent([1, 40])
        .translateExtent([[-100, -100], [w + 90, h + 100]])
        .on("zoom", zoomed);

    var xAxis = d3.axisBottom(x)
        .ticks((w + 2) / (h + 2) * 10)
        .tickPadding(8 - h);

    var yAxis = d3.axisRight(y)
        .ticks(10)
        .tickPadding(8 - w);

    var gX = svg.append("g")
        .attr("class", "axis axis--x")
        .call(xAxis);

    var gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    svg.call(zoomer);

    function zoomed() {
        linegraph.attr("transform", "translate( " + d3.event.transform.x + ", 0)" +
            "scale("+ d3.event.transform.k+", 1)");
        // d3.selectAll(".typeline")
        //     .attr("transform", "scale("+ d3.event.transform.k+","+ d3.event.transform.k+" )");
        d3.selectAll('.typeline').style("stroke-width", 1/d3.event.transform.k);
        gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));

    }
/////
    car_types.forEach(function(type) {
        linegraph.append("path")
            .attr("id", "type-" + type)
            .attr("class", "typeline")
            .style("fill", "none");
    });

    var ruler = linegraph.append("line")
        .attr("id", "ruler")
        .attr("y1", y(0))
        .attr("y2", y(h))
        .attr("stroke", "#333333");


    var line = d3.line()
        .x(function(d) { return x(d.x); });


    $("#linegraph").on("update", function() {
        var vals = [];

        var pathdata = data[selected_edge];

        pathdata.forEach(function(d) {
            car_types.forEach(function(type) {
                if (d3.select("#check-" + type).property("checked") === true) {
                    vals.push(d[type]);
                }
            });
        });

        y.domain([Math.min(...vals), Math.max(...vals)]);

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
    });

    $("#ruler").on("update", function() {
        var x_val = d3.select("#slider").property("value"),
            x_pos = x(x_val);

        ruler
            .transition().duration(150)
            .attr("x1", x_pos)
            .attr("x2", x_pos);
    });

    $("#linegraph input")
        .on("click", function() {
            if (this.checked === true) {
                d3.select(this.value).attr("display", "true");
            }
            else {
                d3.select(this.value).attr("display", "none");
            }

            $("#linegraph").trigger("update");
        });
});
