/**
 * Name: Sven van Dam
 * Student number: 10529772
 * Programmeerproject
 * VAST Challenge 2017
 */

var time_text;

d3.json("data/table_data.json", function(error, id_data) {

    if (error) throw error;

    // set datatable
    var table = $('table').DataTable({
        "scrollY": window.innerHeight * 0.4,
        "scrollCollapse": true,
        "paging": false,
        "searching": false,
        "info": false,

        // make text of row with speeder red
        "createdRow": function(row, r_data, dataIndex) {
            if ($.inArray(r_data[0], speeder_ids) !== -1) {
                $(row).css('color', 'red');
            }
        }
    });

    time_text = d3.select("#datetext");

    $("table").on("renew", function() {

        // wipe current data
        table.clear();

        // add row with info for each visitor
        edge_ids.forEach(function(ID) {

            var info = id_data[ID],
                route = info.route,
                start = route[0].timestamp,
                end = route[route.length - 1];

                table.row.add([
                    ID,
                    info.car_type,
                    start,
                    end,
                    info.number_stops,
                    info.max_speed.toFixed(2)
                ]);
        });

        // display rows
        table.draw();
    });

    $("table tbody").on("click", "tr", function(event) {

        // save displayed date
        var old_text = time_text.text();

        // retrieve ID of clicked row
        selected_id = $(this).closest("tr").find("td")[0].innerHTML;
        selected_route = id_data[selected_id].route;

        // disable all interaction during animation
        $.blockUI({
            message: null,
            overlayCSS: {opacity: 0}
        });

        // make all items in graph less visible
        d3.select("#graph").selectAll("circle")
            .style("opacity", 0.2);
        d3.select("#graph").selectAll("line")
            .style("stroke-opacity", 0.2);

        // display each step in route with increasing delay
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

        // reset display of graph
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


// highlights step in route of visitor
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

            // display timestamp under slider
            time_text
                .text(stamp);
        }
    }, time);
}
