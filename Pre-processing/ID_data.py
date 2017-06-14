import json


with open("../data/route_per_ID.json", "r") as f:
    routes = json.load(f)

with open("../data/sensor_data_per_ID.json", "r") as f:
    data = json.load(f)

for key in routes.keys():
    data[key]["route"] = routes[key]

with open("../data/id_data.json", "w") as f:
    json.dump(data, f)
