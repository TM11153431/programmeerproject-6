import json
import time
import datetime

speeding_year = {}

with open("../Data/graph.json") as f:
    graphdata = json.load(f)

with open("../Data/route_per_ID.json") as f:
    routes = json.load(f)

with open("../data/scatter_data.json", "r") as f:
    scatter = json.load(f)


def date2seconds(date):
    return time.mktime(
        time.strptime(date, "%d/%m/%Y %H:%M")
    )


def calculate_speed(date):

    with open("walked_paths.json", "r") as f:
        links = json.load(f)

    time_min = date2seconds(date)
    time_max = time_min + 24 * 60 * 60 - 60

    routedata = {}

    for key, value in routes.items():
        for log in value:
            if time_min <= date2seconds(log["timestamp"]) <= time_max:
                if key in routedata.keys():
                    routedata[key].append(log)
                else:
                    routedata[key] = [log]


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

    with open("../data/graph.json", "r") as f:
        graphdata_new = json.load(f)

    new_links = []
    made_links = []

    for source in links.keys():
        for target in links[source].keys():
            try:
                links[source][target]["speed"] = sum(links[source][target]["speed"]) / len(links[source][target]["speed"]) - 25
                links[source][target]["speeder_rate"] = len(links[source][target]["speeders"]) / len(links[source][target]["visitors"])
            except:
                links[source][target]["speed"] = 0
                links[source][target]["speeder_rate"] = 0

            if source + "--" + target not in made_links:
                new_links.append({
                    "source": source,
                    "target": target,
                    "steps": links[source][target]["steps"],
                    "rate": links[source][target]["speeder_rate"],
                    "speed": links[source][target]["speed"],
                    "visitors": links[source][target]["visitors"],
                    "speeders": links[source][target]["speeders"]
                })

                made_links.append(source + "--" + target)
                made_links.append(target + "--" + source)

    graphdata_new["links"] = new_links

    date.replace("/", "-")
    date.replace(" 00:00", "")

    speeding_year[date] = graphdata_new


n_days = 397
start = datetime.datetime.strptime('01/05/2015', '%d/%m/%Y')
dates = [(start + datetime.timedelta(days=i)).strftime('%d/%m/%Y %H:%M') for i in range(n_days)]

for d in dates:
    calculate_speed(d)

with open("../data/speeding_graph_data.json", "w") as f:
    json.dump(speeding_year, f)
