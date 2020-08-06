from employeedirectory.constants import FIELDS_MAP
from employeedirectory.models import HRMS


class EmployeeDirectoryManager:
    def __init__(self, each_row=None):
        if each_row:
            self.data = {}
            self.set_data_dict(each_row)

    def set_data_dict(self, each_row):
        for key, value in FIELDS_MAP.items():
            self.data.__setitem__(key, each_row.get(value))

    def get_value(self, key):
        return self.data.get(key)

    def create_record(self):
        new_record = HRMS()
        for field in HRMS._meta.fields:
            if field.name != 'id':
                value = self.get_value(field.name)
                setattr(new_record, field.name, value)

        new_record.save()

    @staticmethod
    def delete_all_records():
        try:
            HRMS.objects.all().delete()
        except Exception as e:
            print(str(e))
