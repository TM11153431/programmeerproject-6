# Sven van Dam

from PIL import Image
import numpy as np
import sys

sys.setrecursionlimit(50000)


def search(node, current, previous, array, count):

    next_places = []
    surrounding = [
        [current[0] + 1, current[1]],
        [current[0] - 1, current[1]],
        [current[0], current[1] + 1],
        [current[0], current[1] - 1]
    ]

    for place in previous:
        if place in surrounding:
            surrounding.remove(place)

    previous.append(current)

    for place in surrounding:
        if array[place[0], place[1]] == 35:
            next_places.append(place)
        elif 28 <= array[place[0], place[1]] <= 33:
            node.add_reach({
                'place': place,
                'steps': count + 1
            })

    for place in next_places:
        search(node, place, previous, array, count + 1)

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
        return 'Entrance' + str(type_counts[str(code)])
    elif code == 29:
        type_counts[str(code)] += 1
        return 'General gate' + str(type_counts[str(code)])
    elif code == 30:
        type_counts[str(code)] += 1
        return 'Gate' + str(type_counts[str(code)])
    elif code == 31:
        type_counts[str(code)] += 1
        return 'Camping' + str(type_counts[str(code)])
    elif code == 32:
        type_counts[str(code)] += 1
        return 'Ranger base' + str(type_counts[str(code)])
    elif code == 33:
        type_counts[str(code)] += 1
        return 'Ranger stop' + str(type_counts[str(code)])


class node:
    def __init__(self, row, col, code):
        self.place = [row, col]
        self.code = code
        self.reachable = []
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
        if pixel < 28:
            map_array[row, col] = 0
            pixel = 0

        if (pixel != 0) and (pixel != 35):
            node_list.append(node(row, col, pixel))


search(node_list[2], node_list[2].place, [None], map_array, 0)
print(node_list[2].reachable)

for node in node_list:
    search(node, node.place, [None], map_array, 0)
    print(node.name)
    print(node.reachable)
