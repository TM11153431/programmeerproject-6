import json
import time
speeding_year = {}

with open("../old/graph.json") as f:
    graphdata = json.load(f)

with open("../old/route_per_ID.json") as f:
    routedata = json.load(f)

with open("../old/scatter_data.json", "r") as f:
    scatter = json.load(f)


def date2seconds(date):
    return time.mktime(
        time.strptime(date, "%d/%m/%Y %H:%M")
    )


def calculate_speed():

    super_speed = 0

    with open("walked_paths.json", "r") as f:
        links = json.load(f)

    for ID in routedata.keys():
        prev_time = 0
        prev_place = None

        route = routedata[ID]

        scatter["ids"][ID]["max_speed"] = 0
        for log in route:
            seconds = time.mktime(
                time.strptime(log["timestamp"], "%d/%m/%Y %H:%M")
            )
            diff = seconds - prev_time + 30

            location = log["gate"]

            if prev_time != 0:
                try:
                    steps = links[prev_place][location]["steps"]
                    speed = (steps * 0.06) / (diff / 3600)
                    if speed > scatter["ids"][ID]["max_speed"]:
                        scatter["ids"][ID]["max_speed"] = speed
                    if speed > super_speed:
                        super_speed = speed
                except:
                    print("error")
                    print(prev_place)
                    print(location)
                    print(ID)

            prev_time = seconds
            prev_place = location

    print(super_speed)


calculate_speed()

with open("../data/scatter_data.json", "w") as f:
    json.dump(scatter, f)
