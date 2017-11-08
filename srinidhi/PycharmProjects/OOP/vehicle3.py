
class Vehicle(object):
    vehicleType = ""
    vehicleColor = ""

    def __init__(self,color):
        self.vehicleColor = color

    def get_no_of_wheels(self):
        pass

    def display(self):
        print "Type is %s" % self.vehicleType, "Color is %s" % self.vehicleColor

class Bus(Vehicle):
    vehicleWheels = 6

    def __init__(self,color):
        Vehicle.__init__(self,color)
        self.vehicleType = "Land"

    def get_no_of_wheels(self):
        return self.vehicleWheels

class Aeroplane(Vehicle):
    vehicleWheels = 7

    def __init__(self, color):
        Vehicle.__init__(self, color)
        self.vehicleType = "Air"

    def get_no_of_wheels(self):
        return self.vehicleWheels

class Car(Vehicle):
    vehicleWheels = 4

    def __init__(self, color):
        Vehicle.__init__(self, color)
        self.vehicleType = "Land"

    def get_no_of_wheels(self):
        return self.vehicleWheels

class Ship(Vehicle):
    vehicleWheels = 0

    def __init__(self, color):
        Vehicle.__init__(self, color)
        self.vehicleType = "Sea"

    def get_no_of_wheels(self):
        return self.vehicleWheels

class CustomVehicle(Vehicle):

    def __init__(self):
        self.vehicleType = raw_input("Type")
        self.vehicleColor = raw_input("Color")

    def get_no_of_wheels(self):
        self.vehicleWheels = int(raw_input("Wheels"))
        return self.vehicleWheels

v1=Car("Red")
print "Wheels = %d" % v1.get_no_of_wheels()
v1.display()

v2=Bus("Red")
print "Wheels = %d" % v2.get_no_of_wheels()
v2.display()

v3=Aeroplane("Red")
print "Wheels = %d" % v3.get_no_of_wheels()
v3.display()

v4=Ship("Red")
print "Wheels = %d" % v4.get_no_of_wheels()
v4.display()

v5=CustomVehicle()
print "Wheels = %d" % v5.get_no_of_wheels()
v5.display()
