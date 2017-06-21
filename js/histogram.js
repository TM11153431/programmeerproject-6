d3.json("../data/histo_data.json", function(error, data) {

    if (error) throw error;

    var bins = ["<15", "15-25", "25-35", "35-45", "45-55", "55-65", "65-75", ">75"];

    var w = window.innerWidth * 0.5,
        h = window.innerHeight * 0.5;

    var histogram = d3.select("#histogram").append("svg")
        .attr("width", w)
        .attr("heigth", h)
        .append("g");


    var hx = d3.scaleOrdinal()
            .domain(bins)
            .range([0, w]),
        hy = d3.scaleLinear()
            .domain([0, 1])
            .range([0, h]);

    histogram.selectAll("rect")
        .data(bins)
        .enter().append("rect")
            .attr("x", function(d, i) { return i * 30; })
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 40)
            .style("fill", "blue");

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
            .attr("height", function(d) { console.log(d.speed + "--" + d.vals.length / total);return hy(d.vals.length / total); });
    });
});
