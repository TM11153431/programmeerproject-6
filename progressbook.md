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

# 12/06
Speed calculation on roads now works. Corrections in the distance of paths for diagonals had to be imposed to obtain realistic looking results.

A lot of time has been spent on figuring out how to structure the dataset(s). I wanted to be able to retain the possibility to select arbitrary time intervals. This would require that the javascript code calculates values like average speed etc. dynamically after that the date range has been set. This takes a lot of calculations which results in a (very) slow page.
For this reason I have decided not to add dynamic date ranges. Instead, I will generate a file for every day of the year with pre-calculated averages etc.
This will increase the loading time of the page (365 different datafiles) but the response times will likely be quite fast.

See the design.md file for a up-to-date idea of how the final product should look and work and which data formats it requires.

To-dos:
- Restructure all files and folders (it is becoming a mess)
- Write a function which assigns a id to a path. Whether it has been crossed from A to B or from B to A.
- Generate data of the paths for every day of the year separately
- Generate dataset with speeding data of every path throughout the year
- Reformat the sensor_data_per_ID.json file so that it contains all data which has to be shown in the table

# 13/06
Speeding data has been generated. Edges of the graph now are colored by speeding. The colors are made with a logarithmic scale on the product of the rate of speeders and the average mph above the speed limit of the speeders. While the dataset does contain values for all days of the year, updating is not working yet. Should be done tomorrow.
