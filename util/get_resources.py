from json import loads


def selection_sort(input):
    length = len(input)

    for i in range(length - 1):
        min = i

        for j in range(i + 1, length):
            if input[j] < input[min]:
                min = j

        tmp = input[i]
        input[i] = input[min]
        input[min] = tmp


with open("config/monitor.json", "r") as f:
    config = loads(f.read())

resources = []

for section_name in config:
    section = config[section_name]
    type = section["type"]

    if type == "youtube_video":
        resource = section["resource_id"]
        resources.append(f"https://www.youtube.com/watch?v={resource}")

    elif type == "youtube_playlist":
        resource = section["resource_id"]
        resources.append(f"https://www.youtube.com/playlists?list={resource}")

    elif type == "image_cycle":
        resources += [f"./static/img/monitor/{image}" for image in section["images"]]

selection_sort(resources)
for resource in resources:
    print(resource)
