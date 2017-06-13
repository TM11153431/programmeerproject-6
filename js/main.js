/**
 * Name: Sven van Dam
 * Student number: 10529772
 * Programmeerproject
 * VAST Challenge 2017
 */

window.onload = function() {

    var width = window.innerWidth * 0.75,
        height = window.innerHeight;

    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);

    var g = svg.append("g")
        .attr("class", "everything");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var edgecolor = d3.scaleLog()
        .range(["lightgreen", "red"])
        .domain([0.01, 175]);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    // add zoom capabilities
    var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(svg);

    d3.json("../Data/data-sven.json", function(error, data) {

        if (error) throw error;

        var keys = Object.keys(data),
            graph = data[keys[0]];


    // set slider values to years in data
    d3.select("#slider")
        .attr("min", 0)
        .attr("max", 390)
        .attr("value", 0)
        .on("input", update_day);

    function update_day() {
        index = d3.select("#slider").property("value");
        graph = data[keys[index]];


        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

    }



    var speeds = graph.links.map(function(d) { return d.speed; });
    var max_speed = Math.max(...speeds);

    var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");

    var node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.xpos * 4;
            })
            .attr("y1", function (d) {
                return d.source.ypos * 4;
            })
            .attr("x2", function (d) {
                return d.target.xpos * 4;
            })
            .attr("y2", function (d) {
                return d.target.ypos * 4;
            })
            .style("stroke", function(d) {
                return edgecolor(d.rate * d.speed + 0.01)
            })
            .on("mouseover", function(d) {
                link.style("stroke-opacity", function(l) {
                    if (d === l) {
                        return 1;
                    }
                    else {
                        return 0.05;
                    }
                });
            })
            .on("mouseout", function(d) {
                link.style("stroke-opacity", 1);
            });

        node
            .attr("r", 5)
            .attr("cx", function (d) {
                return d.xpos * 4;
            })
            .attr("cy", function (d) {
                return d.ypos * 4;
            })
            .on("mouseover", function(d) {
                link.style("stroke-opacity", function(l) {
                    if ((d === l.source || d === l.target) === false) {
                        return 0.05;
                    }
                    else {
                        return 1;
                    }
                });
            })
            .on('mouseout', function() {
                link.style("stroke-opacity", 1);
            });
        }
    });

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.xpos * 4;
        d.fy = d.ypos * 4;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    //Zoom functions
    function zoom_actions(){
        g.attr("transform", d3.event.transform);
    }

};
