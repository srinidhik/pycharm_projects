from abc import ABCMeta, abstractmethod

class Address(object):

    def __init__(self, h_no, street_name, city_name, state, pin_code):
        self.h_no = h_no
        self.street_name = street_name
        self.city_name = city_name
        self.state = state
        self.pin_code = pin_code

###############################

class Person(object):

    def __init__(self, name, date_of_birth,h_no, street_name, city_name, state, pin_code, telephone, ssn):
        self.address = Address(h_no, street_name, city_name, state, pin_code)
        self.name = name
        self.date_of_birth = date_of_birth
        self.telephone = telephone
        self.ssn = ssn

    def change_addr(self,h_no,street_name,city_name,state,pin_code):
        self.address = Address(h_no, street_name, city_name, state, pin_code)

##############################

class Student(Person):

    def __init__(self,name,date_of_birth,h_no,street_name,city_name,state,pin_code,telephone,ssn,standard,roll_no):
        Person.__init__(self,name,date_of_birth,h_no,street_name,city_name,state,pin_code,telephone,ssn)
        self.standard = standard
        self.roll_no = roll_no

#################################

class Teacher(Person):

    def __init__(self,name, date_of_birth,h_no,street_name,city_name,state,pin_code, telephone, ssn,emp_no,role,subjects):
        Person.__init__(self, name, date_of_birth,h_no,street_name,city_name,state,pin_code, telephone, ssn)
        self.emp_no = emp_no
        self.role = role
        self.subjects = subjects

##################################

class College(object):

    def __init__(self, name, address, telephone):
        self.name = name
        self.address = address
        self.telephone = telephone
        self.list_of_student = []
        self.list_of_teacher = []
        self.list_of_student_course = {}

    def set_address(self, h_no, street_name, city_name, state, pin_code):
       self.address = Address(h_no,street_name,city_name,state,pin_code)

    def add_teacher(self, t):
        self.list_of_teacher.append(t)

    def remove_teacher(self, empno):
        flag = 0
        for i in range(0,len(self.list_of_teacher)):
            if empno == self.list_of_teacher[i].emp_no:
                flag = 1
                del self.list_of_teacher[i]
                break
        if flag == 0:
            print "Emp No %d Not Present" %empno

    def add_student(self, s):
        self.list_of_student.append(s)

    def remove_student(self, rollno):
        flag = 0
        for i in range(0, len(self.list_of_student)):
            if rollno == self.list_of_student[i].roll_no:
                flag = 1
                del self.list_of_student[i]
                del self.list_of_student_course[rollno]
                break
        if flag == 0:
            print "Roll No %d Not Present" %rollno

    def subscribe_course(self, roll_no,cor):
        list_cor=cor.split(',')
        self.list_of_student_course.update({roll_no:list_cor})
        print self.list_of_student_course

    def unsubscribe_course(self, roll_no,cor):
        flag = 0
        for i in range(0, len(self.list_of_student_course[roll_no])):
            if cor == self.list_of_student_course[roll_no][i]:
                flag = 1
                del self.list_of_student_course[roll_no][i]
                break
        if flag == 0:
            print "Roll No %d Not Present" % roll_no

        print self.list_of_student_course

    def search_student(self, roll_no):
        flag = 0
        for i in range(0,len(self.list_of_student)):
            if roll_no == self.list_of_student[i].roll_no:
                flag = 1
                print "%s" % self.list_of_student[i].name
        if flag == 0:
            print "Roll No %d Not Present" % roll_no

    def list_subs_by_student(self, roll_no):
        flag = 0
        for i in range(0, len(self.list_of_student)):
            if roll_no == self.list_of_student[i].roll_no:
                flag = 1
                print "%s" % self.list_of_student_course[self.list_of_student[i].roll_no]
                break
        if flag == 0:
            print "Roll No %d Not Present" % roll_no

    def list_subs_by_course(self, course):
        for i in range(0, len(self.list_of_student_course)):
            roll = self.list_of_student[i].roll_no
            for j in range(0, len(self.list_of_student_course[roll])):
                if course == self.list_of_student_course[roll][j]:
                    print(roll)

    def display(self, obj):
        if obj == 't':
            for i in range(0, len(self.list_of_teacher)):
                print " %s" % self.list_of_teacher[i].name, " %d" % self.list_of_teacher[i].emp_no,  "%s" % self.list_of_teacher[i].date_of_birth, " %s" % self.list_of_teacher[i].telephone,\
                    " %s" % self.list_of_teacher[i].address.h_no, " %s" % self.list_of_teacher[i].address.street_name, " %s" % self.list_of_teacher[i].address.city_name, " %s" % self.list_of_teacher[i].address.state,\
                    " %s" % self.list_of_teacher[i].address.pin_code, " %s" % self.list_of_teacher[i].role, "%s" % self.list_of_teacher[i].subjects, " %s" % self.list_of_teacher[i].ssn

        if obj == 's':
            for i in range(0, len(self.list_of_student)):
                print " %s" % self.list_of_student[i].name, " %d" % self.list_of_student[i].roll_no, "%s" % self.list_of_student[i].date_of_birth, " %s" % self.list_of_student[i].telephone,\
                    " %s" % self.list_of_student[i].address.h_no, " %s" % self.list_of_student[i].address.street_name, "%s" % self.list_of_student[i].address.city_name, " %s" % self.list_of_student[i].address.state,\
                    " %s" % self.list_of_student[i].address.pin_code, " %s" % self.list_of_student[i].standard, "%s" % self.list_of_student[i].ssn, " %s" % self.list_of_student_course[self.list_of_student[i].roll_no]

##########################################



if __name__ == '__main__':

    address = Address("1-2/3", "Street", "City", "TS", "500000")
    c = College("aaa", "addr", "123123")

    while(1):

        print "1. add_teacher  2. remove_teacher  3. add_student  4. remove_student  5. subscribe_course  6. unsubscribe_course  7. search_student  8. list_student  9. list_course  10. exit"
        choice = int(raw_input("enter choice"))

        if choice == 1:
            t=Teacher(raw_input("enter name"), raw_input("dob"), raw_input("h no "), raw_input("street name ") , raw_input("city name "), raw_input("state name ") , raw_input("pin "),
                      raw_input("telephone"),raw_input("ssn"),int(raw_input("enter emp NO")),raw_input("role "), raw_input("subjects "))
            c.add_teacher(t)

        elif choice == 2:
            c.remove_teacher(int(raw_input("emp No")))

        elif choice == 3:
            s = Student(raw_input("name"),raw_input("dob"), raw_input("h no "), raw_input("street name ") , raw_input("city name "), raw_input("state name ") , raw_input("pin "),
                        raw_input("telephone"), raw_input("ssn"),raw_input("standard"), int(raw_input("roll NO")))
            c.add_student(s)

        elif choice == 4:
            c.remove_student(int(raw_input("roll no ")))

        elif choice == 5:
            c.subscribe_course(int(raw_input("roll no ")),raw_input("subjects "))

        elif choice == 6:
            c.unsubscribe_course(int(raw_input("roll no ")),raw_input("subject "))

        elif choice == 7:
            c.search_student(int(raw_input("roll No ")))

        elif choice == 8:
            c.list_subs_by_student(int(raw_input("roll no ")))

        elif choice == 9:
            c.list_subs_by_course(raw_input("course name "))

        elif choice == 10:
            break

        elif choice == 11:
            c.display(raw_input("t or s"))

        elif choice == 12:
            c.set_address( raw_input("h no "), raw_input("street name ") , raw_input("city name "), raw_input("state name ") , raw_input("pin "))