from collections import OrderedDict


class USERS_COLUMNS:
    columns = [
        (u"EmployeeName", 8000),
        (u"MedplusCode", 6000),
        (u"EmployeeCode", 6000),
        (u"HRMS_Dept", 6000),
        (u"Status", 6000)
    ]
    columns_keys = [
        "EmployeeName", "MedplusCode", "EmployeeCode", "HRMS_Dept", "Status"
    ]


class DEPARTMENT_COLUMNS:
    columns = [
        (u"EmployeeName", 8000),
        (u"MedplusCode", 6000),
        (u"EmployeeCode", 6000),
        (u"HRMS_Dept", 6000),
        (u"UMS_Dept", 6000)
    ]
    columns_keys = [
        "EmployeeName", "MedplusCode", "EmployeeCode", "HRMS_Dept", "UMS_Dept"
    ]


class LOCATION_COLUMNS:
    columns = [
        (u"EmployeeName", 8000),
        (u"MedplusCode", 6000),
        (u"EmployeeCode", 6000),
        (u"HRMS_Dept", 6000),
        (u"HRMS_Location", 12000),
        (u"UMS_Location", 12000)
    ]
    columns_keys = [
        "EmployeeName", "MedplusCode", "EmployeeCode", "HRMS_Dept", "HRMS_Location", "UMS_Location"
    ]


class ZERO_ROLES_USERS_COLUMNS:
    columns = [
        (u"EmployeeName", 8000),
        (u"MedplusCode", 6000),
        (u"EmployeeCode", 6000),
        (u"HRMS_Dept", 6000),
        (u"HRMS_Location", 8000),
        (u"JobTitle", 6000)
    ]
    columns_keys = [
        "EmployeeName", "MedplusCode", "EmployeeCode", "HRMS_Dept", "HRMS_Location", "JobTitle"
    ]


FIELDS_MAP = OrderedDict([('employeeCode', 'Employee Code'),
                          ('medplusCode', 'Medplus Code'),
                          ('employeeName', 'Employee Name'),
                          ('subCompanyName', 'Sub-Company Name'),
                          ('state', 'State'),
                          ('city', 'City'),
                          ('location', 'Location'),
                          ('departmentName', 'Department Name'),
                          ('jobTitle', 'Job Title'),
                          ('employmentStatusName', 'Employment Status Name'),
                          ('immediateHeadName', 'Immediate Head Name'),
                          ('dateOfJoining', 'Date of Joining'),
                          ('shiftType', 'Shift Type'),
                          ('shiftInTime', 'Shift In Time'),
                          ('shiftOutTime', 'Shift Out Time'),
                          ('phoneNumber', 'Phone Number'),
                          ('workEmailId', 'Work E-mail Id')])


DOWNLOAD_PATH = "/static/files/employeedirectory/"
