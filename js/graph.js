/**
 * Name: Sven van Dam
 * Student number: 10529772
 * Programmeerproject
 * VAST Challenge 2017
 */



    var edge_ids = [],
        speeder_ids = [],
        selected_edge,
        selected_id,
        selected_route;

    function edge_id_gen(start, end) {
        temp = [start, end];
        temp.sort();

        return temp[0] + "-" + temp[1];
    }

    d3.json("data/speeding_graph_data.json", function(error, data) {

        if (error) throw error;

        var width = window.innerWidth * 0.45,
            height = window.innerHeight * 0.45;

        var graph_svg = d3.select('#graph').append('svg')
            .attr('width', "100%")
            .attr('height', height);

        var g = graph_svg.append("g")
            .attr("class", "everything");

        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var edgecolor = d3.scaleLinear()
            .range(["lightgreen", "red"])
            .domain([0.01, 30]);

        var graphx = d3.scaleLinear()
                .range([0, graph_svg.attr("width")])
                .domain([0, 200]),
            graphy = d3.scaleLinear()
                .range([0, graph_svg.attr("height")])
                .domain([0, 200]);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        var keys = Object.keys(data),
            graph = data[keys[0]];

        d3.select("#slider")
            .attr("min", 0)
            .attr("max", keys.length - 1)
            .attr("value", 0)
            .on("input", function() {
                update();
                graph.links.forEach(function(link) {
                    if (edge_id_gen(link.source.id, link.target.id) == selected_edge) {
                        edge_ids = link.visitors;
                        speeder_ids = link.speeders;
                    }
                });

                $("table").trigger("renew");
                $("#scatter").trigger("update");
                $("#ruler").trigger("update");
                $("#histogram").trigger("update");
            });

        function update() {
            index = d3.select("#slider").property("value");
            graph = data[keys[index]];

            d3.select("#datetext")
                .text(dates[index]);

            d3.select(".links").selectAll("line")
                .data(graph.links);

            simulation.force("link")
                .links(graph.links);

            ticked();

        }


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
            .attr("id", function(d) { return d.id; })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        var tip = g.append("text")
            .attr("class", "tooltip")
            .style("text-anchor", "middle");

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
                    return edgecolor(d.visitors.length * d.rate * d.speed);
                })
                .style("display", function(d) {
                    if (d.visitors.length === 0) {
                        return "none";
                    }
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
                .on("mouseout", function() {
                    link.style("stroke-opacity", 1);
                })
                .on("click", function(d) {
                    selected_edge = edge_id_gen(d.source.id, d.target.id);
                    edge_ids = d.visitors;
                    speeder_ids = d.speeders;

                    link.style("stroke-width", 2);
                    d3.select(this).style("stroke-width", 5);

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
                .on("mouseover", function(d) {
                    link.style("stroke-opacity", function(l) {
                        if ((d === l.source || d === l.target) === false) {
                            return 0.05;
                        }
                        else {
                            return 1;
                        }
                    });

                    tip
                        .attr("x", graphx(d.xpos))
                        .attr("y", graphy(d.ypos - 5))
                        .style("opacity", 1)
                        .text(d.id);
                    d3.select(this).append("text").text(d.id);
                })
                .on('mouseout', function() {
                    link.style("stroke-opacity", 1);
                    tip.style("opacity", 0);
                });
            }

            function dragstarted(d) {
                    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.xpos * 3;
                    d.fy = d.ypos * 3;
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

    });
