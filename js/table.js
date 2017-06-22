d3.json("data/table_data.json", function(error, id_data) {

    if (error) throw error;

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

    var w = window.innerWidth * 0.5,
        h = window.innerHeight * 0.5;

    // var histogram = d3.select("#histogram")
    //     .append("svg")
    //         .attr("width", "100%")
    //         .attr("height", h);

    // var ids,
    //     vars = ["number_stops", "max_speed"],
    //     coeff, coeff2,
    //     filtered,
    //     week_current;
    //
    // var w = window.innerWidth * 0.5,
    //     h = window.innerHeight * 0.5;
    //
    // var x = d3.scaleLinear()
    //         .range([25, w - 5])
    //         .domain([0, 50]),
    //     y = d3.scaleLinear()
    //         .range([h - 5, 5])
    //         .domain([0, 150]);
    //
    // var scatter = d3.select("#scatter").append("svg")
    //     .attr("width", "100%")
    //     .attr("height", h + 50);
    //
    // var scatter_g = scatter.append("g");
    //
    // var trendline = scatter_g.append("line")
    //     .attr("stroke", "navy");
    //
    // var xaxis = scatter_g.append("g")
    //     .attr("transform", "translate(0," + h  + ")")
    //     .call(d3.axisBottom(x));
    // var yaxis = scatter_g.append("g")
    //     .attr("transform", "translate(25,0)")
    //     .call(d3.axisLeft(y));
    //
    // $("#scatter").on("update", function() {
    //
    //     filtered = [];
    //
    //     var slider_val = d3.select("#slider").property("value"),
    //     week = Math.floor((18 + slider_val / 7 - 1) % 53) + 1;
    //     if (week != week_current){
    //
    //         ids = data.weeks[week];
    //
    //         ids.forEach(function(id) {
    //             temp = [];
    //             vars.forEach(function(variable) {
    //                 temp.push(data.ids[id][variable]);
    //             });
    //             filtered.push(temp);
    //         });
    //
    //         coeff = regression('linear', filtered).equation;
    //
    //         var dots = scatter_g.selectAll("circle")
    //             .data(filtered);
    //
    //         dots
    //             .exit().remove();
    //
    //         dots
    //             .enter().append("circle");
    //
    //         dots
    //             .transition().duration(300)
    //             .attr("r", 2)
    //             .attr("cx", function(d) { return x(d[0]); })
    //             .attr("cy", function(d) { return y(d[1]); })
    //             .style("fill", "grey");
    //
    //         trendline
    //             .transition().duration(300)
    //             .attr("x1", x(0))
    //             .attr("y1", y(coeff[1]))
    //             .attr("x2", w)
    //             .attr("y2", y(coeff[1] + 30 * coeff[0]));
    //
    //         week_current = week;
    //     }
    // });
});
