// +-+-+-+-+ +-+-+-+-+-+-+-+-+-+ +-+-+-+-+
// |V|A|S|T| |C|H|A|L|L|E|N|G|E| |2|0|1|7|
// +-+-+-+-+ +-+-+-+-+-+-+-+-+-+ +-+-+-+-+
// PETER VAN TWUYVER, 10872809
// MINOR PROGRAMMEREN UVA 2017
// +-+-+-+-+ +-+-+-+-+-+-+-+-+-+ +-+-+-+-+
function onRectClicked(item, svg, plop, wat) {
    console.log(svg);
    console.log(item);
    console.log(plop);
    console.log();
}
window.onload = function() {
    getOption();
};
// get User selection and select appropriate function to draw svg's
function getOption() {
    var obj = document.getElementById("mySelect");
    // clear all previous subcalendars
    var sub = d3.select('#subcalendar')
    sub.selectAll("div").remove();
    if (obj.value == "Campsites") {
        drawLinechart("data/yeartraffic_camps.tsv");
        showData("data/all_campings.csv", "Campsites");
        // type-calendars info:
        var all_types = ['camping0', 'camping1', 'camping2', 'camping3', 'camping4', 'camping5', 'camping6', 'camping7', 'camping8'];
        // send data from each row to Draw function
        all_types.forEach(function(item) {
            drawLocations(item);
        });
    }
    if (obj.value == "Entrances") {
        drawLinechart("data/yeartraffic_entrances.tsv");
        showData("data/all_entrances.csv", "Entrances");
        // type-calendars
        var all_types = ['entrance0', 'entrance1', 'entrance2', 'entrance3', 'entrance4'];
        // send data from each row to Draw function
        all_types.forEach(function(item) {
            drawLocations(item);
        });
    }
    if (obj.value == "Total") {
        drawLinechart("data/yeartraffic_park.tsv");
        showData("data/busyness_by_type.csv", "Total Park");
        // type-calendars
        var all_types = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Ranger'];
        // send data from each row to Draw function
        all_types.forEach(function(item) {
            drawType(item);
        });
    }
}
// bind data based on csv file chosen
function showData(csv_file_name, location) {
    d3.csv(csv_file_name, function(error, csv) {
        if (error) throw error;
        console.log("Read: " + csv_file_name);
        var data = d3.nest()
            .key(function(d) {
                return d.Day;
            })
            .rollup(function(v) {
                return d3.sum(v, function(d) {
                    return d.Total;
                });
            })
            .object(csv);
        drawTotalCalendar(data, location);
    });
}
// draw the main calendar
function drawTotalCalendar(my_data, location) {
    var width = 650,
        height = 100,
        cellSize = 10;
    // set colorgradient for min/max values
    var max = d3.max(d3.values(my_data));
    var min = d3.min(d3.values(my_data));
    console.log("min/max in Total: ", min, max)
    var color = d3.scaleLinear()
        .domain([min, max])
        .range(["#fee0d2", "#de2d26"]);
    // Root SVG objects within #calendar div
    var cal = d3.select("#calendar")
        .selectAll("svg")
        .data(d3.range(2015, 2017)); // range of years
    // remove old data in calendar
    cal.exit().remove();
    var svg = cal.enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
    // // Defines test for year in calendar
    // svg.append("text")
    //     .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 10)
    //     .attr("text-anchor", "middle")
    //     .text(function(d) {
    //         return d;
    //     });

    // svg.append("text")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 6)
    //     .attr('x', 10)
    //     .attr('y', -5)
    //     .attr("text-anchor", "under")
    //     .text("Number of unique vehicles at "+location);
    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .text(location);
    svg.append("text") // MUST BE CORRECTED! DOES NOT REFRESH
        .style("text-anchor", "end")
        .attr("font-size", 10)
        .attr("dy", " -.25em")
        .attr("dx", " 1em")
        .text("Range: "+min+"-"+max);
    var rectSelect = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .selectAll("rect")
        .data(function(year) {
            return d3.timeDays(new Date(year, 0, 1), new Date(year + 1, 0, 1));
        });
    var rect = rectSelect
        .enter().append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
            return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
        })
        .attr("y", function(d) {
            return d.getDay() * cellSize;
        })
        .datum(d3.timeFormat("%d/%m/%Y"))
        .on('click', onRectClicked)
        .append('title');
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(function(d) {
            return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("path")
        .attr("d", pathMonth);
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var legend = svg.selectAll(".legend")
        .data(month)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(" + (((i + 1) * 42) + 8) + ",0)";
        });
    legend.append("text")
        .attr("class", function(d, i) {
            return month[i]
        })
        .style("text-anchor", "end")
        .attr("dy", "-.25em")
        .text(function(d, i) {
            return month[i]
        });

    // var week_days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

    // svg.append("text")
    //     .attr("transform", "translate(-5," + cellSize*(i+1) + ")")
    //     .style("text-anchor", "end")
    //     .attr("dy", "-.25em")
    //     .text(function(d) { return week_days[i]; });
    d3.select("#calendar").selectAll("rect")
        .attr("fill", function(d) {

            if (d in my_data) {
                return color(my_data[d]);
            } else {
                return "grey";
            }
        })
        .select("title")
        .text(function(d) {
            if (d in my_data) {
                return d + ": " + my_data[d];
            } else {
                return "No data";
            }
        });
    // create visual line separating months
    function pathMonth(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(),
            w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
            d1 = t1.getDay(),
            w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize +
            "H" + w0 * cellSize + "V" + 7 * cellSize +
            "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize +
            "H" + (w1 + 1) * cellSize + "V" + 0 +
            "H" + (w0 + 1) * cellSize + "Z";
    }
};
// draws the sub-calendars for Types
function drawType(which_type) {
    var width = 460,
        height = 100,
        cellSize = 8;
    // append sub-calendars under the main calendar
    var root = d3.select('#subcalendar').append('div');
    var svg = root
        .selectAll("svg")
        .data(d3.range(2015, 2017))
        .enter().append("svg")
        // add class to svg based on type
        .attr("class", which_type)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
    // svg.append("text")
    //     .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 10)
    //     .attr("text-anchor", "middle")
    //     .text(function(d) {
    //         return d;
    //     });

    // svg.append("text")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 15)
    //     .attr('x', 10)
    //     .attr('y', -5)
    //     .attr("text-anchor", "under")
    //     .text("Total moving vehicles of Type " + which_type);
    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .text(which_type);

    var rect = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .selectAll("rect")
        .data(function(d) {
            return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
            return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
        })
        .attr("y", function(d) {

            return d.getDay() * cellSize;
        })
        .datum(d3.timeFormat("%d/%m/%Y"))
        .on('click', onRectClicked);

    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(function(d) {
            return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("path")
        .attr("d", pathMonth);

    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var legend = svg.selectAll(".legend")
        .data(month)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(" + (((i + 1) * 34) + 8) + ",0)";
        });

    legend.append("text")
        .attr("class", function(d, i) {
            return month[i]
        })
        .style("text-anchor", "end")
        .attr("dy", "-.25em")
        .text(function(d, i) {
            return month[i]
        });

    d3.csv("data/busyness_by_type.csv", function(error, csv) {
        if (error) throw error;

        var data = d3.nest()
            .key(function(d) {

                return d.Day;
            })
            .rollup(function(d) {
                return parseInt(d[0][which_type])
            })
            .object(csv);
        console.log("data in Types: ", data)

        // set colorgradient for min/max values
        var max = d3.max(d3.values(data));
        var min = d3.min(d3.values(data));
        console.log("min/max for type " + which_type, min, max)
        svg.append("text")
                .style("text-anchor", "middle")
                .attr("font-size", 8)
                .attr("dy", " 0em")// PLACE MUST BE CORRECTED!
                .attr("dx", " 0em")
                .text("Range: "+min+"-"+max);
        var color = d3.scaleLinear()
            .domain([min, max])
            .range(["#fee0d2", "#de2d26"]);

        rect.filter(function(d) {
                return d in data;
            })
            .attr("fill", function(d) {
                return color(data[d]);
            })
            .append("title")
            .text(function(d) {
                return d + ": " + data[d];
            });
    });

    function pathMonth(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(),
            w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
            d1 = t1.getDay(),
            w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize +
            "H" + w0 * cellSize + "V" + 7 * cellSize +
            "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize +
            "H" + (w1 + 1) * cellSize + "V" + 0 +
            "H" + (w0 + 1) * cellSize + "Z";
    }
};

// draws the sub-calendars for locations
function drawLocations(which_location) {

    var width = 460,
        height = 100,
        cellSize = 8;

    // var color = d3.scaleLinear()
    //     .domain([min, max]) // MUST BE RELATIVE TO MIN AND MAX
    //     .range(["#fee0d2", "#de2d26"]);

    // append sub-calendars under the main calendar
    var root = d3.select('#subcalendar').append('div');

    var svg = root
        .selectAll("svg")
        .data(d3.range(2015, 2017))
        .enter().append("svg")
        // add class to svg based on location
        .attr("class", which_location)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    // svg.append("text")
    //     .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 10)
    //     .attr("text-anchor", "middle")
    //     .text(function(d) {
    //         return d;
    //     });
    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .text(which_location);
    // svg.append("text")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 15)
    //     .attr('x', 10)
    //     .attr('y', -5)
    //     .attr("text-anchor", "under")
    //     .text("Moving vehicles at " + which_location);
    var rect = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .selectAll("rect")
        .data(function(d) {
            return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
            return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
        })
        .attr("y", function(d) {
            return d.getDay() * cellSize;
        })
        .datum(d3.timeFormat("%d/%m/%Y"))
        .on('click', onRectClicked)

    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(function(d) {
            return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("path")
        .attr("d", pathMonth);
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var legend = svg.selectAll(".legend")
        .data(month)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(" + (((i + 1) * 34) + 8) + ",0)";
        });

    legend.append("text")
        .attr("class", function(d, i) {
            return month[i]
        })
        .style("text-anchor", "end")
        .attr("dy", "-.25em")
        .text(function(d, i) {
            return month[i]
        });

    d3.csv("data/busylocations.csv", function(error, csv) {
        if (error) throw error;

        var data = d3.nest()
            .key(function(d) {

                if (d.Day.length == 8) {
                    return d.Day.substring(0, 6) + "20" + d.Day.substring(6, 8);
                }



                return d.Day;
            })
            .rollup(function(d) {

                return parseInt(d[0][which_location])
            })
            .object(csv);
        console.log("data in Locations: ", data)
        // set colorgradient for min/max values
        var max = d3.max(d3.values(data));
        var min = d3.min(d3.values(data));
        console.log("min/max for type " + which_location, min, max)
        svg.append("text")
                .style("text-anchor", "middle")
                .attr("font-size", 8)
                .attr("dy", " 0em") // PLACE MUST BE CORRECTED!
                .attr("dx", " 0em")
                .text("Range: "+min+"-"+max);
        var color = d3.scaleLinear()
            .domain([min, max])
            .range(["#fee0d2", "#de2d26"]);

        rect.filter(function(d) {
                return d in data;
            })
            .attr("fill", function(d) {
                return color(data[d]);
            })
            .append("title")
            .text(function(d) {
                return d + ": " + data[d];
            });
    });

    function pathMonth(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(),
            w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
            d1 = t1.getDay(),
            w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize +
            "H" + w0 * cellSize + "V" + 7 * cellSize +
            "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize +
            "H" + (w1 + 1) * cellSize + "V" + 0 +
            "H" + (w0 + 1) * cellSize + "Z";
    }
};

// set up linechart svg and clean
var setupGraph = function() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();
    return svg;
}
function drawLinechart(linechart_file) {

    var svg = setupGraph();
    svg = d3.select("#linechart").select("svg"),

        margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        },
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select("#linechart").select("svg").exit().remove();

    var parseTime = d3.timeParse("%d-%m-%Y");

    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) {
            return x(d.Day);
        })
        .y(function(d) {
            return y(d.vehicles);
        });
    // read the data from file
    d3.tsv(linechart_file, type, function(error, data) {
        if (error) throw error;

        var types = data.columns.slice(1).map(function(id) {
            return {
                id: id,
                values: data.map(function(d) {
                    return {
                        Day: d.Day,
                        vehicles: d[id]
                    };
                })
            };
        });

        x.domain(d3.extent(data, function(d) {
            return d.Day;
        }));

        y.domain([
            d3.min(types, function(c) {
                return d3.min(c.values, function(d) {
                    return d.vehicles;
                });
            }),
            d3.max(types, function(c) {
                return d3.max(c.values, function(d) {
                    return d.vehicles;
                });
            })
        ]);

        z.domain(types.map(function(c) {
            return c.id;
        }));

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Unique vehicles");

        var type = g.selectAll(".type")
            .data(types)
            .enter().append("g")
            .attr("class", "type");

        type.append("path")
            .attr("class", "line")
            .attr("d", function(d) {
                return line(d.values);
            })
            .style("stroke", function(d) {
                return z(d.id);
            });

        type.append("text")
            .datum(function(d) {
                return {
                    id: d.id,
                    value: d.values[d.values.length - 1]
                };
            })
            .attr("transform", function(d) {
                return "translate(" + x(d.value.Day) + "," + y(d.value.vehicles) + ")";
            })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(function(d) {
                return d.id;
            });
    });

    function type(d, _, columns) {
        d.Day = parseTime(d.Day);
        for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        return d;
    }

};
