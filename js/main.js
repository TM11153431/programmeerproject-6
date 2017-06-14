/**
 * Name: Sven van Dam
 * Student number: 10529772
 * Programmeerproject
 * VAST Challenge 2017
 */

window.onload = function() {

    var edge_ids = [],
        speeder_ids = [],
        selected_edge,
        selected_id,
        selected_route;

    d3.json("data/speeding_graph_data.json", function(error, data) {

        if (error) throw error;

        var width = window.innerWidth * 0.75,
            height = window.innerHeight;

        var graph_svg = d3.select('#graph').append('svg')
            .attr('width', "100%")
            .attr('height', height * 0.9);

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

        // add zoom capabilities
        var zoom_handler = d3.zoom()
            .on("zoom", zoom_actions);

        zoom_handler(graph_svg);

        var keys = Object.keys(data),
            graph = data[keys[0]];

        d3.select("#slider")
            .attr("min", 0)
            .attr("max", keys.length - 1)
            .attr("value", 0)
            .on("input", function() {
                update();
                for (var i = 0, n = graph.links.length; i < n; i++) {
                    if (graph.links[i].index == selected_edge) {
                        edge_ids = graph.links[i].visitors;
                        speeder_ids = graph.links[i].speeders;
                        break;
                    }
                }
                $("table").trigger("renew");
            });

        function update() {
            index = d3.select("#slider").property("value");
            graph = data[keys[index]];

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
                    return d.source.id + "-" + d.target.id;
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
                    selected_edge = d.index;
                    edge_ids = d.visitors;
                    speeder_ids = d.speeders;

                    link.style("stroke-width", 2);
                    d3.select(this).style("stroke-width", 5);

                    $("table").trigger("renew");
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
                })
                .on('mouseout', function() {
                    link.style("stroke-opacity", 1);
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

            //Zoom functions
            function zoom_actions(){
                    g.attr("transform", d3.event.transform);
                }
    });

    var routes_per_ID;


    d3.json("data/id_data.json", function(error, data) {

        if (error) throw error;

        var table = $('table').DataTable({
            "scrollY": window.innerHeight * 0.9,
            "scrollCollapse": true,
            "paging": false,
            "info": false,
            "createdRow": function(row, data, dataIndex) {
                if ($.inArray(data[0], speeder_ids) !== -1) {
                    $(row).css('color', 'red');
                }
            }
        });

        $("table").on("renew", function() {
            table.clear();
            var data_by_id = [];

            for (var i = 0, n = edge_ids.length; i < n; i++) {
                var route = data[edge_ids[i]].route,
                    start = route[0].timestamp,
                    end = route[route.length - 1].timestamp;

                data_by_id.push([
                    edge_ids[i],
                    data[edge_ids[i]]["car-type"],
                    start,
                    end
                ]);
            }
            table.rows.add(data_by_id).draw();
        });

        $("table tbody").on("click", "tr", function(event) {
            selected_id = $(this).closest("tr").find("td")[0].innerHTML;
            selected_route = data[selected_id].route;
            $.blockUI({
                message: null,
                overlayCSS: {opacity: 0}
            });

            d3.select("#graph").selectAll("circle")
                .style("opacity", 0.2);
            d3.select("#graph").selectAll("line")
                .style("stroke-opacity", 0.2);

            function set_focus(id, id_prev, time, line_id, line_id2) {
                setTimeout(function() {
                    if (time !== 0) {
                        d3.select("#" + id_prev)
                            .attr("r", 5);
                        d3.select("#" + id)
                            .style("opacity", 1)
                            .attr("r", 10);
                        d3.select("#" + line_id)
                            .style("stroke-opacity", 1);
                        d3.select("#" + line_id2)
                            .style("stroke-opacity", 1);
                    }
                }, time);
            }

            for (var i = 0, n = selected_route.length; i < n; i++) {
                var id = selected_route[i].gate,
                    id_prev = "";

                    if (i > 0) {
                        id_prev = selected_route[i - 1].gate;
                    }
                    var line_id = id_prev + "-" + id,
                        line_id2 = id + "-" + id_prev;
                set_focus(id, id_prev, i * 600, line_id, line_id2);
            }

            setTimeout(function() {
                d3.selectAll("circle")
                    .style("opacity", 1)
                    .attr("r", 5);
                d3.select("#graph").selectAll("line")
                    .style("stroke-opacity", 1);
                $.unblockUI();
            }, 600 * selected_route.length);

        });
    });


};
