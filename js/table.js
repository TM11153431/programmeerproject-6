/**
 * Name: Sven van Dam
 * Student number: 10529772
 * Programmeerproject
 * VAST Challenge 2017
 */


d3.json("data/table_data.json", function(error, id_data) {

    if (error) throw error;

    var table = $('table').DataTable({
        "scrollY": window.innerHeight * 0.4,
        "scrollCollapse": true,
        "paging": false,
        "searching": false,
        "info": false,
        "createdRow": function(row, r_data, dataIndex) {
            if ($.inArray(r_data[0], speeder_ids) !== -1) {
                $(row).css('color', 'red');
            }
        }
    });

    var time_text = d3.select("#datetext");

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
        var old_text = time_text.text();

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
                .text(old_text);
        }, 600 * selected_route.length);

    });
});
