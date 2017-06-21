import json

with open("../data/scatter_data.json", "r") as f:
    data_in = json.load(f)

data_out = data_in["ids"]

with open("../data/table_data.json", "w") as f:
    json.dump(data_out, f)
