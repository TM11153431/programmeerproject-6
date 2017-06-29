/**
 * Name: Sven van Dam
 * Student number: 10529772
 * Programmeerproject
 * VAST Challenge 2017
 */


 var w = window.innerWidth * 0.45,
     h = window.innerHeight * 0.45;


// global variables
var edge_ids = [],
    speeder_ids = [],
    selected_edge,
    selected_id,
    selected_route;

// converts two node id's to one edge id
function edge_id_gen(start, end) {
    temp = [start, end];
    temp.sort();

    return temp[0] + "-" + temp[1];
}


d3.json("data/speeding_graph_data.json", function(error, data) {

    if (error) throw error;

    // updates graph
    function update() {
        index = d3.select("#slider").property("value");
        graph = data[keys[index]];

        // update displayed date
        d3.select("#datetext")
            .text(dates[index]);

        // feed new data to graph
        d3.select(".links").selectAll("line")
            .data(graph.links);

        simulation.force("link")
            .links(graph.links);

        // redraw
        ticked();
    }

    // input domains of scales
    var edgedomain = [0, 20],
        graphdomain = [0,200];

    // create svg with g
    var graph_svg = d3.select('#graph').append('svg')
        .attr('width', "100%")
        .attr('height', h),
        g = graph_svg.append("g")
        .attr("class", "everything");

    // node color scale
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    // edge color scale
    var edgecolor = d3.scaleLinear()
        .range(["lightgreen", "red"])
        .domain(edgedomain);

    // x and y scale
    var graphx = d3.scaleLinear()
            .range([0, graph_svg.attr("width")])
            .domain(graphdomain),
        graphy = d3.scaleLinear()
            .range([0, graph_svg.attr("height")])
            .domain(graphdomain);

    // set graph
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(w / 2, h / 2));

    // initialise data
    var keys = Object.keys(data),
        graph = data[keys[0]];

    var legend = g.append("g")
        .attr("transform", "translate(0, 20)");

    var nodelegend = g.append("g")
        .attr("transform", "translate(0, 240)");


    // legend gradient
    var defs = legend.append("defs");

    var gradient = defs.append("linearGradient")
        .attr("id", "gradient");

    // vertical gradient
    gradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    // top color
    gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#FF0000");

    // bottom color
    gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#90EE90");

    // add to rect
    legend.append("rect")
        .attr("width", 10)
        .attr("height", 200)
        .style("fill", "url(#gradient)");

    legend.append("text")
        .attr("class", "graphlegend")
        .attr("x", 0)
        .attr("y", -15)
        .text("Speed index");

    var labels = [
        {"h": 0, "y": 20},
        {"h": 100, "y": 10},
        {"h": 200, "y": 0}
    ];

    var node_types = [
        {"name": "camping", "group": 5},
        {"name": "entrance", "group": 1},
        {"name": "gate", "group": 2},
        {"name": "general-gate", "group": 3},
        {"name": "ranger-base", "group": 6},
        {"name": "ranger-stop", "group": 4}
    ];

    // add labels to legend
    labels.forEach(function(l) {
        legend.append("line")
            .attr("class", "legend-line")
            .attr("x1", 0)
            .attr("x2", 15)
            .attr("y1", l.h)
            .attr("y2", l.h)
            .attr("stroke", "black")
            .attr("stroke-width", "0.5");

        legend.append("text")
            .attr("class", "graphlegend")
            .attr("x", 15)
            .attr("y", l.h)
            .text(l.y);
    });

    node_types.forEach(function(type, i) {
        nodelegend.append("circle")
            .attr("cy", i * 15)
            .attr("cx", 5)
            .attr("r", 5)
            .attr("fill", color(type.group));

        nodelegend.append("text")
            .attr("class", "graphlegend")
            .attr("x", 12)
            .attr("y", i * 15)
            .text(type.name);
    });


    // set slider behaviour
    d3.select("#slider")
        .attr("min", 0)
        .attr("max", keys.length - 1)
        .attr("value", 0)
        .on("input", function() {
            update();

            // update visitors of selected path
            graph.links.forEach(function(link) {
                if (edge_id_gen(link.source.id, link.target.id) == selected_edge) {
                    edge_ids = link.visitors;
                    speeder_ids = link.speeders;
                }
            });

            // update other elements
            $("table").trigger("renew");
            $("#scatter").trigger("update");
            $("#ruler").trigger("update");
            $("#histogram").trigger("update");
        });

    // g for all edges
    var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
            .attr("class", "graphline");

    // g for all links
    var node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        .attr("id", function(d) { return d.id; });

    // set links and nodes data
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked)
        .force("link")
        .links(graph.links);

    // set tooltip
    var tip = g.append("text")
        .attr("class", "tooltip");

    // draws all elements of graph
    function ticked() {
        link
            .attr("x1", function (d) {
                return graphx(d.source.xpos);
            })
            .attr("y1", function (d) {
                return graphy(d.source.ypos);
            })
            .attr("x2", function (d) {
                return graphx(d.target.xpos);
            })
            .attr("y2", function (d) {
                return graphy(d.target.ypos);
            })
            .attr("id", function(d) {
                return edge_id_gen(d.source.id, d.target.id);
            })
            .style("stroke", function(d) {
                return edgecolor(d.speeders.length * Math.pow(d.speed, 1.3));
            })
            .style("display", function(d) {
                if (d.visitors.length === 0) {
                    return "none";
                }
            })

            // set focus on hover
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
            .on("mouseout", function() {
                link.style("stroke-opacity", 1);
            })

            // update data on click
            .on("click", function(d) {
                selected_edge = edge_id_gen(d.source.id, d.target.id);
                edge_ids = d.visitors;
                speeder_ids = d.speeders;

                // increase stroke width for focus
                link.style("stroke-width", 2);
                d3.select(this).style("stroke-width", 5);

                d3.select("#pathtext")
                    .text(selected_edge + ", ");

                // upate other elements
                $("table").trigger("renew");
                $("#linegraph").trigger("update");
                $("#histogram").trigger("update");
                $("#ruler").trigger("update");
            });

        node
            .attr("r", 5)
            .attr("cx", function (d) {
                return graphx(d.xpos);
            })
            .attr("cy", function (d) {
                return graphy(d.ypos);
            })

            // highlight all connected edges on focus
            .on("mouseover", function(d) {
                link.style("stroke-opacity", function(l) {
                    if ((d === l.source || d === l.target) === false) {
                        return 0.05;
                    }
                    else {
                        return 1;
                    }
                });

                // show name of node on hover
                tip
                    .attr("x", graphx(d.xpos))
                    .attr("y", graphy(d.ypos - 5))
                    .style("opacity", 1)
                    .style("display", "block")
                    .text(d.id);
                d3.select(this).append("text").text(d.id);
            })

            // hide tip and reset highlight
            .on('mouseout', function() {
                link
                    .style("stroke-opacity", 1);
                tip
                    .style("opacity", 0)
                    .style("display", "none");
            });
        }
});
