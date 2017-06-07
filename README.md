# Programmeerproject
## Sven van Dam, 1052977

Part of VAST challenge team. For more info, see:

http://vacommunity.org/tiki-index.php?page=VAST+Challenge+2017+MC1&ok=y&iTRACKER=1#wikiplugin_tracker1

# Project proposal

The aim of the project is to identify patterns in visitor behaviour which could affect the bird population in a fictive wildlife park.
Available data consists of a log with a timestamp, the visitor ID, type of vehicle and location of the log. Logs are only taken at specific points in the park such as gates.
Along with the data comes a crude map of the park which gives the locations of all 
This data can be transformed to retrieve info such as 

The visualisations which will form the product of this project should make the user able to identify patterns of visitor behaviour.
These visualisations will focus on the driving speed and sound production of vehicles.

There will be three visualisations:

1. A map of the park with colors of the roads defined by the average speed or number of vehicles which drives too fast 
![map](/doc/map.JPG)
1. A heatmap of aproximated noise prduced by vehicles acorss the park
![map](/doc/heatmap.JPG)
1. A barchart which shows the distribution of different types of vehicles for a selected road. Color of the bar shows the avg driving speed.
![map](/doc/bar.JPG)

Before the visualisations are made, the data will be analysed. Based on the findings during this stage, the mentioned visualisations could change drastically.

Analysis of the data will be done in python, visualisations are made using d3. Needed libraries will follow during the project.
Possible difficulties could arise when te proposed ways of visualisation do not lead to insights to answer te questions of the challenge.
Another danger is the number of ways in which visitor behaviour can be analysed. It is essential not to let the scope of the project become too wide.
This would likely result in a lot of work which is not done thoroughly.

Since the case is a fictive and created for an congress, no other projects on this exact topic are available. However, there is an abundance of examples on maps, heatmaps and barcharts in d3 available.

The MVP of this project is a fully functional set of three visualisations which enable the user to find insightfull patterns in visitor behaviour.
If this proves to be reachable fairly easily, the project could be extended by adding more graphs on the behaviour on roads.
Besides that, visualisations aimed at the analysis of single visitors instead of avewrage behaviour on roads could lead to a new dimension of insights.
