# Design
## Sven van Dam
## 10529772

*The choice of visualisations can be changed when other forms seem to be more useful*

The result of this project will consist of four items. In addition to this, there will be a slider to switch between weeks.

### General layout:
![layout](/doc/layout.jpeg)

### Slot 1 - graph
The edges of the graph will display the rate of speeders using colours. A edge can be selected to show more in-depth info in other slots. The graph represents the values of one  week.

The data needed for this graph:
1. Rate of speeders for the color of the edges
1. Average speed for hover info
1. ID of edge
1. List of visitors for table

![graph](/doc/graph.png)

### Slot 2 - Table
The table will show a list of visitors of the selected path for a certain day. The table will show for each visitor:
1. ID
1. Vehicle type and code
1. Entrance day
1. Exit day

The table will most likely be made with bootstrap tables

![table](/doc/table.jpeg)

### Slot 3 - Linegraph

The line graph will show the rate of speeding for a selected path throughout the year. Each vehicle type gets its own line

![line](/doc/linechart.jpeg)

### Slot 4 - Path on map
When a visitor is selected in the table, the map shows the route this visitor has taken through the park. This is done by drawing arrows over the map. The appear one by one.

![map](/doc/map_path.jpeg)



