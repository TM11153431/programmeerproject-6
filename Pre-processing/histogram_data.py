import json
import datetime
import time

with open("../data/id_data.json", "r") as f:
    ids = json.load(f)

with open("../old/route_per_ID.json") as f:
    routedata = json.load(f)

with open("../data/path_busyness.json", "r") as f:
    paths = json.load(f)

with open("walked_paths.json", "r") as f:
    links = json.load(f)

id_array = ids.keys()
path_array = paths.keys()

weeks = range(1, 53)
weeks = [str(w) for w in weeks]

histo_data = {}

for path in path_array:
    histo_data[path] = {}
    for week in weeks:
        histo_data[path][week] = {
            "<15": [],
            "15-25": [],
            "25-35": [],
            "35-45": [],
            "45-55": [],
            "55-65": [],
            "65-75": [],
            ">75": []
        }


def path_ID(start, end):
    out_arr = [start, end]
    out_arr.sort()
    return out_arr[0] + "-" + out_arr[1]


def week_nr(x):
    week = str(datetime.datetime.strptime(x, "%d/%m/%Y %H:%M").isocalendar()[1])
    if week == "53":
        week = "52"
    return week


def date2seconds(date):
    return time.mktime(
        time.strptime(date, "%d/%m/%Y %H:%M")
    )


def daynight(date):
    hour = time.strptime(date, "%d/%m/%Y %H:%M").tm_hour

    if (22 <= hour < 24) or (0 <= hour < 6):
        return "n"

    return "d"


def speed2bin(speed):
    if speed < 15:
        return "<15"
    elif 15 <= speed < 25:
        return "15-25"
    elif 25 <= speed < 35:
        return "25-35"
    elif 35 <= speed < 45:
        return "35-45"
    elif 45 <= speed < 55:
        return "45-55"
    elif 55 <= speed < 65:
        return "55-65"
    elif 65 <= speed < 75:
        return "65-75"
    else:
        return ">75"


for ID in routedata.keys():
    prev_time = 0
    prev_place = None

    route = routedata[ID]
    for log in route:
        seconds = time.mktime(
            time.strptime(log["timestamp"], "%d/%m/%Y %H:%M")
        )
        week = week_nr(log["timestamp"])
        diff = seconds - prev_time - 30

        location = log["gate"]


        if prev_time != 0:
            try:
                steps = links[prev_place][location]["steps"]
                speed = (steps * 0.06) / (diff / 3600)
                histo_data[path_ID(location, prev_place)][week_nr(log["timestamp"])][speed2bin(speed)].append({
                    "day/night": daynight(log["timestamp"]),
                    "type": ids[ID]["car-type"],
                    "id": ID
                })
            except:
                print("error")
                print(prev_place)
                print(location)
                print(ID)
                print(week_nr(log["timestamp"]))

        prev_time = seconds
        prev_place = location

for path in histo_data.keys():
    for week in histo_data[path].keys():
        temp = histo_data[path][week]
        out = []
        for speed in temp.keys():
            out.append({
                "speed": speed,
                "vals": temp[speed]
            })
        histo_data[path][week] = out

with open("../data/histo_data.json", "w") as f:
    json.dump(histo_data, f)
