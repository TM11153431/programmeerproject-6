import json
import copy


def convert(place):
        transform = {
            "ranger-base0": "ranger-base",
            "camping1": "camping8",
            "camping2": "camping1",
            "camping3": "camping2",
            "camping4": "camping3",
            "camping5": "camping4",
            "camping6": "camping5",
            "camping8": "camping6",
        }

        if place in transform.keys():
            place = transform[place]

        return place


with open("../data/graph_old.json", "r") as f:
    data = json.load(f)

with open("walked_paths.json", "r") as f:
    walked = json.load(f)

data_out = copy.deepcopy(data)

new = []

for key in walked.keys():
    for key2 in walked[key].keys():
        x = {
            "source": key,
            "target": key2,
            "value": walked[key][key2]["steps"]
        }
        new.append(x)

for place in data_out["nodes"]:
    place["id"] = convert(place["id"])

data_out["links"] = new

with open("../data/graph.json", "w") as f:
    json.dump(data_out, f)
