"""Event class to create a structure"""
class Event(object):
    """Event class
        Attributes:
            name, information, date, city, country
        Methods:
            set_value(input), get_value() are common for all attributes, where value=Attribute.
    """

    def __init__(self,name,date,city,info):
        self.name =name
        self.date = date
        self.city = city
        self.info = info

    def set_name(self, name):
        self.name = name

    def get_name(self):
        return self.name

    def set_date(self, date):
        self.date = date

    def get_date(self):
        return self.date

    def set_city(self, city):
        self.city = city

    def get_city(self):
        return self.city

    def set_info(self, info):
        self.info = info

    def get_info(self):
        return self.info

