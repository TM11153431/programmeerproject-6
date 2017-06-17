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

    function edge_id_gen(start, end) {
        temp = [start, end];
        temp.sort();

        return temp[0] + "-" + temp[1];
    }

    d3.json("data/speeding_graph_data.json", function(error, data) {

        if (error) throw error;

        var width = window.innerWidth * 0.5,
            height = window.innerHeight * 0.5;

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
                    if (edge_id_gen(graph.links[i].source.id, graph.links[i].target.id) == selected_edge) {
                        edge_ids = graph.links[i].visitors;
                        speeder_ids = graph.links[i].speeders;
                        break;
                    }
                }
                $("table").trigger("renew");
                $("#scatter").trigger("update");
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

    d3.json("data/scatter_data.json", function(error, data) {

        if (error) throw error;

        id_data = data.ids;

        var table = $('table').DataTable({
            "scrollY": window.innerHeight * 0.5,
            "scrollCollapse": true,
            "paging": false,
            "info": false,
            "createdRow": function(row, r_data, dataIndex) {
                if ($.inArray(r_data[0], speeder_ids) !== -1) {
                    $(row).css('color', 'red');
                }
            }
        });

        var time_text = d3.select("#graph")
            .append("text");

        $("table").on("renew", function() {
            table.clear();

            for (var i = 1, n = edge_ids.length; i < n; i++) {
                var route = id_data[edge_ids[i]].route,
                    start = route[0].timestamp,
                    end = route[route.length - 1].timestamp;

                    table.row.add([
                        edge_ids[i],
                        id_data[edge_ids[i]].car_type,
                        start,
                        end,
                        id_data[edge_ids[i]].number_stops,
                        id_data[edge_ids[i]].max_speed.toFixed(2)
                    ]);
                }
                table.draw();
            });

        $("table tbody").on("click", "tr", function(event) {
            selected_id = $(this).closest("tr").find("td")[0].innerHTML;
            selected_route = id_data[selected_id].route;
            $.blockUI({
                message: null,
                overlayCSS: {opacity: 0}
            });

            d3.select("#graph").selectAll("circle")
                .style("opacity", 0.2);
            d3.select("#graph").selectAll("line")
                .style("stroke-opacity", 0.2);

            function set_focus(id, id_prev, time, line_id, stamp) {
                setTimeout(function() {
                    if (time !== 0) {
                        d3.select("#" + id_prev)
                            .attr("r", 5);
                        d3.select("#" + id)
                            .style("opacity", 1)
                            .attr("r", 10);
                        d3.select("#" + line_id)
                            .style("stroke-opacity", 1);
                        time_text
                            .text(stamp);
                    }
                }, time);
            }

            for (var i = 0, n = selected_route.length; i < n; i++) {
                var id = selected_route[i].gate,
                    stamp = selected_route[i].timestamp,
                    id_prev = "";

                    if (i > 0) {
                        id_prev = selected_route[i - 1].gate;
                    }
                    var line_id = edge_id_gen(id_prev, id);

                set_focus(id, id_prev, i * 600, line_id, stamp);
            }

            setTimeout(function() {
                d3.select("#graph").selectAll("circle")
                    .style("opacity", 1)
                    .attr("r", 5);
                d3.select("#graph").selectAll("line")
                    .style("stroke-opacity", 1);
                $.unblockUI();
                time_text
                    .text("");
            }, 600 * selected_route.length);

        });

        var ids,
            vars = ["number_stops", "max_speed"],
            coeff, coeff2,
            filtered,
            week_current;


        $("#scatter").on("update", function() {

            filtered = [], full_data = [];

            var slider_val = d3.select("#slider").property("value"),
            week = Math.floor((18 + slider_val / 7 - 1) % 53) + 1;
            if (week != week_current){

                ids = data.weeks[week];

                ids.forEach(function(id) {
                    temp = [];
                    vars.forEach(function(variable) {
                        temp.push(data.ids[id][variable]);
                    });
                    filtered.push(temp);
                });

                coeff = regression('linear', filtered).equation;

                var dots = scatter_g.selectAll("circle")
                    .data(filtered);

                dots
                    .exit().remove();

                dots
                    .enter().append("circle");

                dots
                    .transition().duration(300)
                    .attr("r", 2)
                    .attr("cx", function(d) { return x(d[0]); })
                    .attr("cy", function(d) { return y(d[1]); })
                    .style("fill", "grey");

                trendline
                    .transition().duration(300)
                    .attr("x1", x(0))
                    .attr("y1", y(coeff[1]))
                    .attr("x2", w)
                    .attr("y2", y(coeff[1] + 30 * coeff[0]));

                week_current = week;
            }
        });

        var w = window.innerWidth * 0.5,
            h = window.innerHeight * 0.5;

        var x = d3.scaleLinear()
                .range([25, w - 5])
                .domain([0, 50]),
            y = d3.scaleLinear()
                .range([h - 5, 5])
                .domain([0, 150]);

        var scatter = d3.select("#scatter").append("svg")
            .attr("width", "100%")
            .attr("height", h + 50);

        var scatter_g = scatter.append("g");

        var trendline = scatter_g.append("line")
            .attr("stroke", "navy");

        var xaxis = scatter_g.append("g")
            .attr("transform", "translate(0," + h  + ")")
            .call(d3.axisBottom(x));
        var yaxis = scatter_g.append("g")
            .attr("transform", "translate(25,0)")
            .call(d3.axisLeft(y));

    });

    d3.json("../data/path_busyness.json", function(error, data) {

        if (error) throw error;

        var w = window.innerWidth * 0.5,
            h = window.innerHeight * 0.5;

        var linegraph = d3.select("#linegraph")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g");

        var path = linegraph.append("path")
            .attr("stroke", "navy")
            .style("fill", "none");

        var x = d3.scaleLinear()
                .domain([0, 397])
                .range([5, w - 5]),
            y = d3.scaleLinear()
                .range([h - 5, 5]);


        var line = d3.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });

        $("#linegraph").on("update", function() {
            var vals = [];

            var pathdata = data[selected_edge];

            pathdata.forEach(function(d) {
                vals.push(d.y);
            });

            y.domain([Math.min(...vals), Math.max(...vals)]);
            console.log(pathdata);
            console.log(selected_edge);

            path
                .transition().duration(300)
                .attr("d", line(pathdata));
        });
    });


    $("table").trigger("renew");
    $("#scatter").trigger("update");
};
