import json

with open("../data/weekly_ids.json", "r") as f:
    weeks = json.load(f)

with open("../data/scatter.json", "r") as f:
    scatter = json.load(f)

with open("../data/id_data.json", "r") as f:
    id_routes = json.load(f)

super_speed = 0
super_visits = 0

for ID in scatter.keys():
    scatter[ID]["max_speed"] = 0
    scatter[ID]["route"] = id_routes[ID]["route"]
    if scatter[ID]["max_speed"] > super_speed:
        super_speed = scatter[ID]["max_speed"]
    if scatter[ID]["number_stops"] > super_visits:
        super_visits = scatter[ID]["number_stops"]

data = {"weeks": weeks,
        "ids": scatter}

with open("../data/scatter_data.json", "w") as f:
    json.dump(data, f)

print(super_speed, super_visits)
