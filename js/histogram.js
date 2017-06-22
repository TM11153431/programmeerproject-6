d3.json("../data/histo_data.json", function(error, data) {

    if (error) throw error;

    var bins = ["<15", "15-25", "25-35", "35-45", "45-55", "55-65", "65-75", ">75"],
        bins_x_vals = [];


    var w = window.innerWidth * 0.5,
        h = window.innerHeight * 0.5;

    var stepsize = w / bins.length;

    bins.forEach(function(d, i) {
        bins_x_vals.push(i * stepsize);
    });
    console.log(bins_x_vals);

    var svg = d3.select("#histogram").append("svg")
            .attr("width", "100%")
            .attr("height", h),
        histogram = svg
        .append("g");


    var hx = d3.scaleOrdinal()
            .domain(bins)
            .range(bins_x_vals),
        hy = d3.scaleLinear()
            .domain([0, 1.0001])
            .range([h, 0]);

    histogram.selectAll("rect")
        .data(bins)
        .enter().append("rect")
            .attr("x", function(d, i) { return hx(d) - 15; })
            .attr("width", 30)
            .attr("transform", "translate(35, -25)")
            .style("fill", "blue");

    var hxaxis = d3.axisBottom(hx),
        hyaxis = d3.axisLeft(hy)
            .ticks(5);

    var gX = histogram.append("g")
            .attr("transform", "translate(35, " + (h - 25) + ")")
            .call(hxaxis),
        gY = histogram.append("g")
            .attr("transform", "translate(25, -25)")
            .call(hyaxis);


    $("#histogram").on("update", function() {

        var total = 0;

        var slider_val = d3.select("#slider").property("value"),
        week = Math.floor((18 + slider_val / 7 - 1) % 53) + 1;

        var hist_data = data[selected_edge][week];
        hist_data.forEach(function(d) {
            total += d.vals.length;
        });

        histogram.selectAll("rect")
            .data(hist_data)
            .transition().duration(150)
            .attr("y", function(d) { return hy(d.vals.length / total) || hy(0); })
            .attr("height", function(d) { return h - hy(d.vals.length / total) || 0; })
            .style("display", function(d) {
                console.log(d.speed, d.vals);
                console.log(total);
                if (d.vals == []) {
                    return "none";
                }

                return "true";
            });
    });
});
