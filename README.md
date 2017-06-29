# Programmeerproject
## Sven van Dam, 1052977

Part of VAST challenge team. For more info, see:

http://vacommunity.org/tiki-index.php?page=VAST+Challenge+2017+MC1&ok=y&iTRACKER=1#wikiplugin_tracker1

## Link to page

https://svenvdam.github.io/programmeerproject/

# The product

![screencap](/doc/screencap1.png)

The final product of this project consists of four (semi-) visual elements, along with control elements.
The general aim of the product is to be able to identify speeding and busyness patterns on the paths between checkpoints in the park. Besides that, the tool gives the user the ability to find information of individual visitors.
The four visualizations are:

1. A abstraction of the map of the park in the form of a graph
1. A histogram of driving speeds
1. A Table with info on individual visitors
1. A linegraph which displays the busyness on a path per car type

Each of these is discussed more in-depth below. Above the elements is a slider which can be used to set the date. The provided data ranges from 01/05/2015 to 31/05/2016. The tool assesses each day separately. The selected date is displayed beneath the slider.

# Graph

The graph shows a simplified layout of the park. The positions of all nodes are congruent with those on the provided bitmap. The paths are drawn in straight lines, however. If no visitor has crossed a path on the selected day, the path will not be displayed to make the appearance as clean as possible. The color of the nodes represents the type of checkpoint (entrance, camping, general gate, gate, ranger stop or ranger base), the color of the edges is based on a self-created speed index. This index is as follows:
Let `n` be the number of speeders on a given path on the selected date. Let `s` be the average mph these speeders are above the speed limit. The speeding index is then `n * s^1.3`.
This index assumes that visitors who drive below the speed limit do no harm. Furthermore, the magnitude of the speeding weighs more heavily than the number of speeders but both are taken in account.
Hovering over a node show the name of this node. All paths are clickable. When this is done, all other elements are updated (upon loading the page, these are empty). Besides that, the name of the path is shown next to the selected date. The clicked path gets a broader stroke width to make it distinguishable.

# Histogram

The histogram shows the distribution of measured speeds on the clicked path in the week of the selected date. Weekly data is used since daily data would often result in far to little observations to make the distributions reliable. The number of observations in the given week is displayed in the title of the histogram. Upon hovering over the bars, the count of observations in that bin is displayed above the bar. Data is binned in bins of 5 mph. Note that the first and last bin range to -inf and inf and are thus of a different size than the rest. Hence, when these bins contain observations, the distribution has no statistical interpretation.

# Table

The table displays all logged visits of the clicked path on the selected day. Of this visit, the timestamp, visitor ID, car type, start and end of the visitors stay and the number of registered stops during this stay is displayed. When the estimated speed of the visit of the path exceeds the speed limit (25 mph) the text of that row is red.
When a row is clicked, the entire route of the corresponding visitor is animated on the graph. This is done by iteratively highlighting the paths and nodes of the route. The timestamp of the 'step' in the route is displayed beneath the slider on the place of the selected date (which is displayed when the animation is done).
All columns are sortable.

# Linegraph

When a path is clicked, the linegraph displays the busyness per car type throughout the year on that path. Above the graph there are checkboxes for each car type which give the user the ability to see only a selection of car types. When a certain type is deselected, all entries with that car type are removed from the table as well. The y-axis rescales if the largest group is removed from the graph.
The graph also features a vertical line which moves horizontally in correspondence with the selected date. Since there are rather often a lot of lines at the same height, displaying numbers next to the ruler becomes messy. Instead, the number of visitors with acertain car type is diplayed next to the checkbox. Note that the colors around the checkboxes also make it a legend.


### Included packages
This tool relies on the following packages:
* d3 v4
* jQuery
* Bootstrap
* Datatables
* BlockUI

_Published open source under The Unilicense_
