import json


def path_ID(start, end):
    out_arr = [start, end]
    out_arr.sort()
    return out_arr[0] + "-" + out_arr[1]


with open("walked_paths.json") as f:
    paths = json.load(f)


with open("../data/speeding_graph_data.json") as f:
    speeding_data = json.load(f)

ids = []
busyness = {}

max_per_day = 0


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
        if ID not in checked:
            busyness[ID].append({
                "x": len(busyness[ID]),
                "y": len(link["visitors"])
                })
            checked.append(ID)
            if len(link["visitors"]) > max_per_day:
                max_per_day = len(link["visitors"])

with open("../data/path_busyness.json", "w") as f:
    json.dump(busyness, f)

print(max_per_day)
