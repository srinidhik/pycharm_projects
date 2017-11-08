"""Manager class to handle all the inputs given by user in Main class"""
from jsonhandler import *
from event import *
from datetime import *
import uuid


class Manager(object):
    """
        Attribute:
            json_instance: Instance of JsonHandler class
        Methods:
            add_event(),
            remove_event_by_id(id),
            update_event_by_id(event_id, field_name, field_value),
            search_event_by_id(event_id),
            today_upcoming_and_completed_events(),
            list_events_by_date_and_city(),
            list_events_in_date_range().
    """

    def __init__(self):
        self.json_instance = JsonHandler()

    def add_event(self, event_instance):
        id = uuid.uuid4()
        self.json_instance.dump_file({str(id): event_instance.__dict__})
        return id


    def read_event_by_id(self, event_id):
        storage = self.json_instance.load_file()
        if event_id in storage:
            event_instance = Event(storage[event_id]['name'],
                                   storage[event_id]['date'],
                                   storage[event_id]['city'],
                                   storage[event_id]['info'])

            return event_instance
        else:
            return event_id

    def update_event_by_id(self, id, dic):
        return self.json_instance.update_event_in_file(id, dic)

    def delete_event_by_id(self, event_id):
        return self.json_instance.delete_event_in_file(event_id)

    def events_in_date_range(self, date1, date2):
        storage = self.json_instance.load_file()
        final_list=[]
        if date2 < date1:
            date1,date2 = date2,date1
        for event_id in storage:
            if event_id != 'cities':
                if date1 <= storage[event_id]['date'] <= date2:
                    final_list.append(event_id)

        return final_list

    def list_event_by_date(self, date):
        storage = self.json_instance.load_file()
        final_list=[]
        for key, value in storage.iteritems():
            if key != 'cities':
                if value['date'] == date:
                    final_list.append(key)
        return final_list

    def list_event_by_city(self, city):
        storage = self.json_instance.load_file()
        final_list=[]
        for key, value in storage.iteritems():
            if key!='cities':
                if value['city'] == city:
                    final_list.append(key)
        return final_list

    def list_event_by_date_and_city(self, date, city):
        storage = self.json_instance.load_file()
        final_list=[]
        for key, value in storage.iteritems():
            if key!='cities':
                if value['date'] == date and value['city'] == city:
                    final_list.append(key)
        return final_list


    def today_upcoming_and_completed_events(self):
        temp_data = self.json_instance.load_file()
        today_list = []
        upcoming_list = []
        past_list = []
        final_list = []
        for key, value in temp_data.items():
            if key != 'cities':
                if value['date'] == str(date.today()):
                    today_list.append(key)
                elif value['date'] > str(date.today()):

                    upcoming_list.append(key)
                else:
                    past_list.append(key)

        final_list.append(today_list)
        final_list.append(upcoming_list)
        final_list.append(past_list)
        return final_list


    def update_city(self,city_list):
        return self.json_instance.dump_file({"cities":city_list})