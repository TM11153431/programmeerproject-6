import json

with open("../data/speeding_graph_data.json", "r") as f:
    data = json.load(f)

dates = [d.rstrip("0: ") for d in data.keys()]

out = {"array": dates}

with open("../data/dates.json", "w") as f:
    json.dump(out, f)
