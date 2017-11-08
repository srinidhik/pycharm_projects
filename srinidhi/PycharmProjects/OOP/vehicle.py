
class Vehicle(object):
    vehicleType = ""
    vehicleColor = ""

    def __init__(self,type,color):
        self.vehicleType = type
        self.vehicleColor = color

    def get_no_of_wheels(self):
        pass

    def display(self):
        print "Type is %s" % self.vehicleType, "Color is %s" % self.vehicleColor

class Bus(Vehicle):

    def __init__(self,type,color,wheels):
        Vehicle.__init__(self,type,color)
        self.vehicleWheels = wheels

    def get_no_of_wheels(self):
        return self.vehicleWheels

class Aeroplane(Vehicle):

    def __init__(self,type,color,wheels):
        Vehicle.__init__(self,type,color)
        self.vehicleWheels = wheels

    def get_no_of_wheels(self):
        return self.vehicleWheels

class Car(Vehicle):
    vehicleWheels=0

    def __init__(self,type,color,wheels):
        Vehicle.__init__(self,type,color)
        self.vehicleWheels = wheels


    def get_no_of_wheels(self):
        return self.vehicleWheels

class Ship(Vehicle):

    def __init__(self,type,color,wheels):
        Vehicle.__init__(self,type,color)
        self.vehicleWheels = wheels

    def get_no_of_wheels(self):
        return self.vehicleWheels


v1=Car("Land","Red",4)
print "Wheels = %d" % v1.get_no_of_wheels()
v1.display()

v2=Bus("Land","Red",6)
print "Wheels = %d" % v2.get_no_of_wheels()
v2.display()

v3=Aeroplane("Air","Red",7)
print "Wheels = %d" % v3.get_no_of_wheels()
v3.display()

v4=Ship("Sea","Red",0)
print "Wheels = %d" % v4.get_no_of_wheels()
v4.display()


