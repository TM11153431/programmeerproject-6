import json
import datetime

with open("../data/scatter.json", "r") as f:
    data = json.load(f)

weekly_ids = {}

for i in range(1, 53):
    weekly_ids[str(i)] = []

for key in data.keys():
    val = data[key]
    try:
        stay = val["entrance"]
        weeks = []
        for x in stay:
            weeks.append(
                datetime.datetime.strptime(x, "%d/%m/%Y %H:%M").isocalendar()[1]
            )
        for i in range(weeks[0], weeks[1] + 1):
            weekly_ids[str(i)].append(key)
    except:
        pass

with open("../data/weekly_ids.json", "w") as f:
    json.dump(weekly_ids, f)
