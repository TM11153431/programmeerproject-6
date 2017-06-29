import json


def path_ID(start, end):
    out_arr = [start, end]
    out_arr.sort()
    return out_arr[0] + "-" + out_arr[1]


with open("walked_paths.json") as f:
    paths = json.load(f)


with open("../data/speeding_graph_data.json") as f:
    speeding_data = json.load(f)

with open("../old/id_data.json", "r") as f:
    id_data = json.load(f)

ids = []
busyness = {}

max_per_day = 0

cars = ["1", "2", "2P", "3", "4", "5", "6"]


for source in paths.keys():
    for target in paths[source].keys():
        ID = path_ID(source, target)
        if ID not in ids:
            ids.append(ID)

for ID in ids:
    busyness[ID] = []

for date in speeding_data.keys():
    checked = []
    pathdata = speeding_data[date]["links"]
    for link in pathdata:
        ID = path_ID(link["source"], link["target"])
        visitors = link["visitors"]
        temp = {"x": len(busyness[ID])}

        for car in cars:
            temp[car] = []

        for visit in visitors:
            car = id_data[visit]["car-type"]

            temp[car].append(visit)

        for car2 in cars:
            if temp[str(car2)] == []:
                temp[str(car2)] = 0
            else:
                temp[str(car2)] = len(temp[str(car2)])

        if ID not in checked:
            busyness[ID].append(temp)
            checked.append(ID)

            if len(link["visitors"]) > max_per_day:
                max_per_day = len(link["visitors"])

with open("../data/path_busyness.json", "w") as f:
    json.dump(busyness, f)

print(max_per_day)
