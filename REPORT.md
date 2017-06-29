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
All of this gets done after the relevant datafile has been loaded.
