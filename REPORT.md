# Sven van Dam
## 10529772

Note: since this work is part of the VAST Challenge, this report will be structured different than other reports. For a overview of the results we were able to find in the provided data using our tools, please see our document which has been submitted for the challenge.
This report will provide a brief technical overview of my tool.

![screencap](/doc/screencap1.png)

See the readme for functional details of the tool. A short overview of all elements, what they can affect and where they are affected by:

* slider
** affects: graph, ruler on linegraph, histogram, table
** affected by: user

* graph
** affects: histogram, table, linegraph
** affected by: slider, table

* histogram
** affects: -
** affected by: slider, graph

* table
** affects: graph
** affected by: graph, slider, checkboxes

* checkboxes
** affects: table, linegraph
** affected by: user

* linegraph
** affects: -
** affected by: slider, graph, checkboxes
