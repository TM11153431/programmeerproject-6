import json

with open("../data/weekly_ids.json", "r") as f:
    weeks = json.load(f)

with open("../data/scatter.json", "r") as f:
    scatter = json.load(f)

for ID in scatter.keys():
    scatter[ID]["max_speed"] = 0

data = {"weeks": weeks,
        "ids": scatter}

with open("../data/scatter_data.json", "w") as f:
    json.dump(data, f)
