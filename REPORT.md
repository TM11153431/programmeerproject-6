# Sven van Dam
## 10529772

Note: since this work is part of the VAST Challenge, this report will be structured different than other reports. For a overview of the results we were able to find in the provided data using our tools, please see our document which has been submitted for the challenge.
This report will provide a brief technical overview of my tool.

![screencap](/doc/screencap1.png)

See the readme for functional details of the tool. A short overview of all elements, what they can affect and where they are affected by:

## slider
* affects: graph, ruler on linegraph, histogram, table
* affected by: user

## graph
* affects: histogram, table, linegraph
* affected by: slider, table

## histogram
* affects: -
* affected by: slider, graph

## table
* affects: graph
* affected by: graph, slider, checkboxes

## checkboxes
* affects: table, linegraph
* affected by: user

## linegraph
* affects: -
* affected by: slider, graph, checkboxes

The graph, histogram, table and linegraph each have their own javascript file. Info such as the selected date and path are stored in global variables so that all elements can access it.
The graph file is only affected as a whole by the slider. How to handle changes in the slider is defined in an `update()` function and the `.on("click")`. All other updates are hadled with jQuey using the `$("x").trigger("y")` and `$("x").on("y")` method. This allows to access elements which lie out of the scope of where the action is triggered. The update functions (re)load the elements properties which rely on the data. Which data to use is defined in global variables. These variables store matters like which date is selected or which path is clicked. The slider, graph and checkboxes have the ability to alter which data should be displayed.
Clicking on a row in the table alters the visual appearance of the graph but does not alter the data. The table script itself selects the relevant paths and nodes and highlights those as required.

Each of the javascript files consists of a part where the elements are created and a part which defines how to handle update triggers.
All of this gets done after the relevant datafile has been loaded. Each element relies on its own datafile. All data is in json format. At the highest level the data is divided by either date or id of the visitor or path. The deeper structure of the datafiles depends on what is relevant for the given visualization.

The creation of the graph relies on the `forcesimulation` method in d3v4. The code required for this can be somewhat hard to interpret. Essentially, a set of nodes gets defined with an x and y position. Liks between these nodes are then given and the whole is drawn. The resulting circles and paths have all regular options.
When the slider value changes, data of the new day is selected and the speed indexes for the colors are recalculated.
The function `edge_id_gen` creates an ID for a path. The path from A to B and from B to A will result in the same ID.
The function `update` links new data to the graph, the function `ticked` (re)draws the graph.

The histogram is quite straightforward. The relevant week is calculated from the slider value and the relevant data is then loaded. Total number observations is calculated and height of the bar is determined by the proportion of the observations in each bin.

The table assesses a list of id's which have crossed a path on a given day. It makes a row for each visit and adds extra info of the visitor using its own datafile. When the car type of the visitor is not selected in the checkbox the row is not added. When a row is clicked, the route of the visitor is accessed and each path and node is highlighted one by one.
The function `set_focus` selects the previous node in the route of the visitor, resets the radius, enlarges the radius of the next visited node and highlights the path between those two by increasing the opacity.

The linegraph draws a line for each car type on a path. When a path on the graph is clicked, new data is selected and the lines are drawn. If a checkbox is deselected, the corresponding line will be hidden. The ruler is updated independently from the lingraph, x position is recalculated if the slider value changes. Number of visitors on the selected day gets updated when the slider value changes.
