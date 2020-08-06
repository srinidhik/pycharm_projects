import sys
import os
import django

sys.path.insert(0, '.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medplus.settings')
django.setup()

import csv
from employeedirectory.manager import EmployeeDirectoryManager

file_path = os.getcwd()

class BulkUpload():

    def populate_data_to_db(self):

        EmployeeDirectoryManager().delete_all_records()

        path = file_path + "/static/files/employeedirectory/scripts/new_data.csv"
        with open(path, 'r') as file_data:
            csv_data = csv.DictReader(file_data)
            for row_number, each_row in enumerate(csv_data, 1):
                print(each_row)
                try:
                    record = EmployeeDirectoryManager(each_row)
                    record.create_record()
                except Exception as e:
                    print(str(e))



if __name__ == "__main__":
    execute = BulkUpload()
    execute.populate_data_to_db()

    report_path = file_path + "/employeedirectory/daily_report.py"
    execute = 'python ' + report_path
    os.system(execute)
