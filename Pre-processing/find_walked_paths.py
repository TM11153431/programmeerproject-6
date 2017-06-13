import json
import time
import copy

with open("../Data/graph.json") as f:
    graphdata = json.load(f)


def date2seconds(date):
    return time.mktime(
        time.strptime(date, "%d/%m/%Y %H:%M")
    )


def calculate_speed():

    with open("links.json", "r") as f:
        links = json.load(f)
        links2 = copy.deepcopy(links)

    with open("../Data/route_per_ID.json") as f:
        routedata = json.load(f)

    for ID in routedata.keys():
        prev_place = None

        route = routedata[ID]
        for log in route:

            location = log["gate"]

            if prev_place is not None:
                try:
                    links[prev_place][location]["visitors"].append(ID)
                    links[location][prev_place]["visitors"].append(ID)
                except:
                    print("error")
                    print(prev_place)
                    print(location)
                    print(ID)

            prev_place = location

    for start in links.keys():
        for end in links[start].keys():
            if links[start][end]["visitors"] == []:
                links2[start].pop(end)

    with open("walked_paths.json", "w") as f:
        json.dump(links2, f)


calculate_speed()
