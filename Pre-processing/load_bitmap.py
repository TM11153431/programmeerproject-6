# Sven van Dam

from PIL import Image
import numpy as np
import sys
import json

sys.setrecursionlimit(5000)


def search(node, current, previous, prevprev, array, count, path, steps):

    if count > 5000:
        return

    path.append(current)

    next_places = []
    surrounding = [
        [current[0] + 1, current[1]],
        [current[0] - 1, current[1]],
        [current[0], current[1] + 1],
        [current[0], current[1] - 1]
    ]

    if previous:
        surrounding.remove(previous)
    if prevprev:
        if abs(current[0] - prevprev[0]) == 1 and abs(current[1] - prevprev[1]) == 1:
            steps = steps - 2 + 2 ** 0.5

    for place in surrounding:
        if array[place[0], place[1]] == 35:
            next_places.append(place)
        elif 28 <= array[place[0], place[1]] <= 33:
            found_name = [node.name for node in node_list if node.place == place][0]
            if found_name in node.reachable.keys():
                if node.reachable[found_name]["steps"] > steps + 1:
                    node.reachable[found_name] = {"steps": steps + 1, "speed": [], "speeders": [], "visitors": []}
            else:
                node.reachable[found_name] = {"steps": steps + 1, "speed": [], "speeders": [], "visitors": []}

    for place in next_places:
        search(node, place, current, previous, array, count + 1, path, steps + 1)

    return


type_counts = {
    '28': -1,
    '29': -1,
    '30': -1,
    '31': -1,
    '32': -1,
    '33': -1
}


def define_name(code):
    if code == 28:
        type_counts[str(code)] += 1
        out = 'entrance' + str(type_counts[str(code)])
    elif code == 29:
        type_counts[str(code)] += 1
        out = 'general-gate' + str(type_counts[str(code)])
    elif code == 30:
        type_counts[str(code)] += 1
        out = 'gate' + str(type_counts[str(code)])
    elif code == 31:
        type_counts[str(code)] += 1
        out = 'camping' + str(type_counts[str(code)])
    elif code == 32:
        type_counts[str(code)] += 1
        out = 'ranger-base' + str(type_counts[str(code)])
    elif code == 33:
        type_counts[str(code)] += 1
        out = 'ranger-stop' + str(type_counts[str(code)])

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

    if out in transform.keys():
        out = transform[out]

    return out


class node:
    def __init__(self, row, col, code):
        self.place = [row, col]
        self.code = code
        self.reachable = {}
        self.name = define_name(self.code)

    def add_reach(self, place):
        self.reachable.append(place)


map = Image.open('Lekagul_Roadways.bmp')
map.load()
map_array = np.array(map)

node_list = []

n = 200

for row in range(n):
    for col in range(n):
        pixel = map_array[row, col]
        if pixel < 28 or pixel == 34:
            map_array[row, col] = 0
            pixel = 0

        if (pixel != 0) and (pixel != 35):
            node_list.append(node(row, col, pixel))

node_names = [node.name for node in node_list]

linkfile = {}

for node in node_list:
    search(node, node.place, None, None, map_array, 0, [], 0)
    node.reachable[node.name] = {"steps": 0, "speed": [], "speeders": [], "visitors": []}
    linkfile[node.name] = node.reachable

with open("links.json", "w") as f:
    json.dump(linkfile, f)
