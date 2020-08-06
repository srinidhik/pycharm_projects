import sys
import os
import django

sys.path.insert(0, '.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medplus.settings')
django.setup()

import xlwt
from employeedirectory.constants import DOWNLOAD_PATH, LOCATION_COLUMNS, DEPARTMENT_COLUMNS, USERS_COLUMNS, \
    ZERO_ROLES_USERS_COLUMNS
from employeedirectory.models import HRMS
from medplus.settings import BASE_DIR
from usermanagementsystem.models import TblUser, TblUserRoles, TblUserModuleTeritaryDetail
from django.db.models import Count
from utils.send_mail import send_email_multiple_attachments

files = []


class UsersDataMismatch:

    def __init__(self):
        try:
            hrms_data = HRMS.objects.all().values_list('employeeName', 'medplusCode', 'employeeCode', 'departmentName', 'location', 'jobTitle')
            ums_data = TblUser.objects.all().values_list('name', 'employeeid', 'hrmscode', 'department', 'joblocation', 'status')
            ums_roles_data = TblUserRoles.objects.all().values_list('userid').annotate(Count('roleid'))

            self.hrms_data_map = {k[2] + k[1]: k for k in hrms_data if k[1] and k[2]}
            self.ums_data_map = {l[2] + l[1]: l for l in ums_data if l[1] and l[2]}
            self.ums_roles_data_map = {m[0].lower(): m[1] for m in ums_roles_data}

        except Exception as e:
            print(str(e))

    @staticmethod
    def location_query():
        list_medplus_codes = HRMS.objects.all().values_list('medplusCode', flat=True)
        user_id_ums = TblUser.objects.filter(employeeid__in=list(list_medplus_codes)).values_list('userid', flat=True)

        location_data = {}

        data = TblUserModuleTeritaryDetail.objects.filter(usermoduleteritaryid__userid__in=list(user_id_ums)).values('teritary','usermoduleteritaryid__userid')

        for each_detail in data:
            user_id = each_detail.get('usermoduleteritaryid__userid').lower()
            teritary = each_detail.get('teritary')
            if user_id not in location_data.keys():
                location_data[user_id] = []
            if teritary not in location_data[user_id]:
                location_data[user_id].append(teritary)

        return location_data

    @staticmethod
    def download_data(sheet_name, columns, columns_keys, data):
        wb = xlwt.Workbook(encoding='utf-8')
        ws = wb.add_sheet(sheet_name)
        row_num = 0
        font_style = xlwt.XFStyle()
        font_style.font.bold = True
        for col_num in range(len(columns)):
            ws.write(row_num, col_num, columns[col_num][0], font_style)
            ws.col(col_num).width = columns[col_num][1]
        font_style = xlwt.XFStyle()
        font_style.alignment.wrap = 1
        for case in data:
            row_num += 1
            row = list()

            for key_iter in range(len(columns_keys)):
                row.append(str(case.get(columns_keys[key_iter], None)))

            for col_num in range(len(row)):
                ws.write(row_num, col_num, row[col_num], font_style)

        storage = BASE_DIR + DOWNLOAD_PATH
        path = storage + sheet_name + ".xls"
        wb.save(path)

        files.append(path)

    def location_mismatch(self):
        data = []
        columns_keys = LOCATION_COLUMNS.columns_keys
        try:
            location_data = self.location_query()

            for i in self.hrms_data_map.keys():
                try:
                    hrms_location = self.hrms_data_map[i][4].split(".")[0]
                    teritary_location = location_data.get(self.hrms_data_map[i][1].lower(), [])
                    if (self.hrms_data_map[i][1] == self.ums_data_map[i][1]) and (self.hrms_data_map[i][2] == self.ums_data_map[i][2]) and (hrms_location not in teritary_location):
                        data.append({
                            columns_keys[0]: self.hrms_data_map[i][0],
                            columns_keys[1]: self.hrms_data_map[i][1],
                            columns_keys[2]: self.hrms_data_map[i][2],
                            columns_keys[3]: self.hrms_data_map[i][3],
                            columns_keys[4]: self.hrms_data_map[i][4],
                            columns_keys[5]: ",".join(teritary_location) if teritary_location else None
                        })
                except Exception as e:
                    print(i)

            self.download_data('Location Mismatch', columns=LOCATION_COLUMNS.columns,
                          columns_keys=columns_keys, data=data)

        except Exception as e:
            print(str(e))

    def department_mismatch(self):
        data = []
        columns_keys = DEPARTMENT_COLUMNS.columns_keys
        try:
            for i in self.hrms_data_map.keys():
                try:
                    if (self.hrms_data_map[i][1] == self.ums_data_map[i][1]) and (self.hrms_data_map[i][2] == self.ums_data_map[i][2]) and (self.hrms_data_map[i][3].lower() != self.ums_data_map[i][3].lower()):
                        data.append({
                            columns_keys[0]: self.hrms_data_map[i][0],
                            columns_keys[1]: self.hrms_data_map[i][1],
                            columns_keys[2]: self.hrms_data_map[i][2],
                            columns_keys[3]: self.hrms_data_map[i][3],
                            columns_keys[4]: self.ums_data_map[i][3]
                        })
                except Exception as e:
                    print(i)

            self.download_data('Department Mismatch', columns=DEPARTMENT_COLUMNS.columns,
                          columns_keys=columns_keys, data=data)
        except Exception as e:
            print(str(e))

    def users_mismatch(self):
            data = []
            users_not_found = []
            inactive_users = []
            columns_keys = USERS_COLUMNS.columns_keys
            try:
                for i in self.hrms_data_map.keys():
                    try:
                        if i not in self.ums_data_map.keys():
                            users_not_found.append({
                                columns_keys[0]: self.hrms_data_map[i][0],
                                columns_keys[1]: self.hrms_data_map[i][1],
                                columns_keys[2]: self.hrms_data_map[i][2],
                                columns_keys[3]: self.hrms_data_map[i][3],
                                columns_keys[4]: "USER NOT FOUND"
                            })
                        elif i in self.ums_data_map.keys() and self.ums_data_map[i][5] == "I":
                            inactive_users.append({
                                columns_keys[0]: self.hrms_data_map[i][0],
                                columns_keys[1]: self.hrms_data_map[i][1],
                                columns_keys[2]: self.hrms_data_map[i][2],
                                columns_keys[3]: self.hrms_data_map[i][3],
                                columns_keys[4]: "INACTIVE USER"
                            })
                    except Exception:
                        print(i)

                data.extend(users_not_found)
                data.extend(inactive_users)

                self.download_data('Users Mismatch', columns=USERS_COLUMNS.columns, columns_keys=columns_keys,
                                         data=data)
            except Exception as e:
                print(str(e))

    def users_no_roles(self):
            data = []
            columns_keys = ZERO_ROLES_USERS_COLUMNS.columns_keys
            try:
                for i in self.hrms_data_map.keys():
                    flag = False
                    try:
                        if not (i in self.ums_data_map.keys() and not self.ums_roles_data_map[self.hrms_data_map[i][1].lower()]):
                            pass
                    except Exception:
                        if i in self.ums_data_map.keys():
                            data.append({
                                columns_keys[0]: self.hrms_data_map[i][0],
                                columns_keys[1]: self.hrms_data_map[i][1],
                                columns_keys[2]: self.hrms_data_map[i][2],
                                columns_keys[3]: self.hrms_data_map[i][3],
                                columns_keys[4]: self.hrms_data_map[i][4],
                                columns_keys[5]: self.hrms_data_map[i][5]
                            })
                        else:
                            print(i)

                self.download_data('Users with No Roles', columns=ZERO_ROLES_USERS_COLUMNS.columns, columns_keys=columns_keys,
                                         data=data)
            except Exception as e:
                print(str(e))


if __name__ == "__main__":
    users = UsersDataMismatch()
    users.department_mismatch()
    users.location_mismatch()
    users.users_mismatch()
    users.users_no_roles()
    send_email_multiple_attachments("HRMS Mismatch Data", "", ['srinidhi@kustommade.com', 'sharma@kustommade.com'], cc_list=None, files=files)
