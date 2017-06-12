import json
import time

with open("../Data/graph.json") as f:
    graphdata = json.load(f)

with open("../Data/route_per_ID.json") as f:
    routedata = json.load(f)

with open("links.json", "r") as f:
    links = json.load(f)


linkdata = graphdata["links"]


for ID in routedata.keys():
    prev_time = 0
    prev_place = None

    route = routedata[ID]
    for log in route:
        seconds = time.mktime(
            time.strptime(log["timestamp"], "%d/%m/%Y %H:%M")
        )
        diff = seconds - prev_time - 30

        location = log["gate"]

        if prev_time != 0:
            try:
                steps = links[prev_place][location]["steps"]
                speed = (steps * 0.06) / (diff / 3600)
                if speed > 25:
                    links[prev_place][location]["speeders"].append(ID)
                    links[location][prev_place]["speeders"].append(ID)
                    links[prev_place][location]["speed"].append(speed)
                    links[location][prev_place]["speed"].append(speed)

                links[prev_place][location]["visitors"].append(ID)
                links[location][prev_place]["visitors"].append(ID)
            except:
                print("error")
                print(prev_place)
                print(location)
                print(ID)

        prev_time = seconds
        prev_place = location

for start in links.keys():
    for end in links[start].keys():
        try:
            links[start][end]["speed"] = sum(links[start][end]["speed"]) / len(links[start][end]["speed"]) - 25
            links[start][end]["speeder_rate"] = len(links[start][end]["speeders"]) / len(links[start][end]["visitors"])
            links[start][end]["speeders"] = []
            links[start][end]["visitors"] = []
        except:
            pass

with open("day.json", "w") as f:
    json.dump(links, f)
