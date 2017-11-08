"""Handles all the json dumps and loads"""
import json


class JsonHandler(object):
    """
       Attributes:
           file_name: File name to which json objects are stored
       Methods:
           dump_file(object),
           load_file(): Used by all other methods,
           delete_event_in_file(event_id),
           update_event_in_file(event_id, field_name, field_value).
       """

    def __init__(self):
        self.file_name = "data.json"

    def dump_file(self, x):
        storage = self.load_file()
        with open(self.file_name, "w+") as f:
            if storage is None:
                city_list = []
                x.update({"cities": city_list})
                json.dump(x, f, indent=2)
            else:
                storage.update(x)
                json.dump(storage, f, indent=2)

    def load_file(self):
        with open(self.file_name, "r+") as f:
            if f.read() == '':
                return
            else:
                f.seek(0)
                return json.load(f)

    def update_event_in_file(self, id, dic):
        storage = self.load_file()
        if id in storage:
            with open(self.file_name, "w+") as f:
                storage[id] = dic
                json.dump(storage, f, indent=2)
                return 1
        else:
            return "No id"

    def delete_event_in_file(self, event_id):
        storage = self.load_file()
        if event_id in storage:
            with open(self.file_name, "w+") as f:
                del storage[event_id]
                json.dump(storage, f, indent=2)
                return 1
        else:
            return event_id
