from django.db import models


class HRMS(models.Model):
    employeeCode = models.CharField(db_column="EmployeeCode", max_length=255)
    medplusCode = models.CharField(db_column="MedplusCode", max_length=255)
    employeeName = models.CharField(db_column="EmployeeName", max_length=255)
    subCompanyName = models.CharField(db_column="SubCompanyName", max_length=255)
    state = models.CharField(db_column="State", max_length=255)
    city = models.CharField(db_column="City", max_length=255)
    location = models.CharField(db_column="Location", max_length=255)
    departmentName = models.CharField(db_column="DepartmentName", max_length=255)
    jobTitle = models.CharField(db_column="JobTitle", max_length=255)
    employmentStatusName = models.CharField(db_column="EmploymentStatusName", max_length=255)
    immediateHeadName = models.CharField(db_column="ImmediateHeadName", max_length=255)
    dateOfJoining = models.DateField(db_column="DateOfJoining")
    shiftType = models.CharField(db_column="ShiftType", max_length=255)
    shiftInTime = models.TimeField(db_column="ShiftInTime")
    shiftOutTime = models.TimeField(db_column="ShiftOutTime")
    phoneNumber = models.CharField(db_column="PhoneNumber", max_length=255)
    workEmailId = models.CharField(db_column="WorkEmailId", max_length=255)

    class Meta:
        managed = True
        db_table = 'HRMS_tbl'
