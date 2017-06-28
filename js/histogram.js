/**
 * Name: Sven van Dam
 * Student number: 10529772
 * Programmeerproject
 * VAST Challenge 2017
 */


d3.json("data/histo_data.json", function(error, data) {

    if (error) throw error;

    // possible values
    var bins = ["<15", "15-20", "20-25", "25-30", "30-35", "35-40", "40-45", ">45"],
        bins_x_vals = [];

    // calculate space between bars
    var stepsize = w / bins.length;

    bins.forEach(function(d, i) {
        bins_x_vals.push(i * stepsize);
    });

    // create field
    var svg = d3.select("#histogram").append("svg")
            .attr("width", "100%")
            .attr("height", h),
        histogram = svg
        .append("g")
        .attr("transform", "translate(50, -30)");

    // x and y scales
    var hx = d3.scaleOrdinal()
            .domain(bins)
            .range(bins_x_vals),
        hy = d3.scaleLinear()
            .domain([0, 1.0001])
            .range([h, 35]);

    // tooltip
    var tip = histogram.append("text")
        .attr("class", "tooltip");

    // create bars
    histogram.selectAll("rect")
        .data(bins)
        .enter().append("rect")
            .attr("x", function(d, i) { return hx(d) - 15; })
            .attr("width", 30)
            .style("fill", "navy");

    // create axes
    var hxaxis = d3.axisBottom(hx),
        hyaxis = d3.axisLeft(hy)
            .ticks(5);

    // call axes in g
    var gX = histogram.append("g")
            .attr("transform", "translate(0, " + h + ")")
            .call(hxaxis),
        gY = histogram.append("g")
            .attr("transform", "translate(-15, 0)")
            .call(hyaxis);

    histogram.append("text")
        .text("Speed group (mph)")
        .attr("class", "axis-label")
        .attr("x", w - stepsize)
        .attr("y", h + 25);

    histogram.append("text")
        .text("Fraction")
        .attr("class", "axis-label")
        .attr("x", -30)
        .attr("y", -40)
        .attr("transform", "rotate(-90)");


    $("#histogram").on("update", function() {

        if (selected_edge) {
            var total = 0;

            // calculate week number based on slider value
            var slider_val = d3.select("#slider").property("value"),
            week = Math.floor(slider_val / 7);

            // get data and calculate total visitors
            var hist_data = data[selected_edge][week];
            if (hist_data) {
                hist_data.forEach(function(d) {
                    total += d.vals.length;
                });
            }
            d3.select("#hist_n")
                .text(", n = " + total);
            // set bars based on proportional share of visitors
            histogram.selectAll("rect")
                .data(hist_data)
                .transition().duration(150)
                .attr("y", function(d) { return hy(d.vals.length / total) || hy(0); })
                .attr("height", function(d) { return h - hy(d.vals.length / total) || 0; })
                .style("display", function(d) {
                    if (d.vals == []) {
                        return "none";
                    }
                    return "true";
                })
                // set tooltip for each bar
                .each(function() {
                    d3.select(this)
                        .on("mouseover", function(d) {
                            tip
                                .text("Count: " + d.vals.length)
                                .style("opacity", 1)
                                .attr("x", (parseFloat(d3.select(this).attr("x")) + 15) + "px")
                                .attr("y", (parseFloat(d3.select(this).attr("y")) - 5) + "px");
                        })
                        .on("mouseout", function() {
                            tip
                                .style("opacity", 0);
                        });
                });
        }
    });
});
