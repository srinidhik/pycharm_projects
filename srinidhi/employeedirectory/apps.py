from django.apps import AppConfig


class EmployeeDirectoryAppConfig(AppConfig):
    name = 'employeedirectory'

    def ready(self):
        print('EmployeeDirectory app')