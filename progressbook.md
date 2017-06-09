# 07/06
Focus will be on analysis and preparation of the data until the end of the week.
Conclusions have to be drawn from these analyses in order to decide what kind of visualizations should be made.

Working on crawler which finds all connections between checkpoints on the map.
A working version of this has been developed.
Should only find the shortest paths and not accept double findings.
This all still has to be validated, however. A few checkpoints should be checked by hand.
These results are then compared to the results of the crawler.

Laura and Peter are working on the processing of the data points and a first version of a calendar.

Summary: Processing of the map nearly done.

# 08/06
Design document not made since we are still in the analysis phase. First results have shown that the fraction of vehicle types does not vary much through the year.
This means that the third plot will have to change.
Map crawler fully functional.

# 09/06
Map crawler is finished. Handling of circular paths works well now. Paths found are shortest possible.
The choice has been made to represent the map as a graph and not to change the colors of paths on the map.
This is done because sometimes, multiple paths from A to B are possible and there is no good way of finding which has been taken.
Graphs rely on a single line. Downside that the number of lines can make the graph rather crowded.

When an edge is selected, a linegraph should appear beneath the graph which shows the number of speeders through time on that path.
Next to the graph appears a table with all visitors which have crossed that path i the selected time period.
When one of these visitors, their paths are shown on the map with arrows.

A page with the graph has been added.
