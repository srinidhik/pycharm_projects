class Vehicle(object):
    vehicleType = ""
    vehicleColor = ""

    def __init__(self,type,color):
        self.vehicleType = type
        self.vehicleColor = color

    def get_no_of_wheels(self):
        pass

class Car(Vehicle):
    vehicleWheels = 4

    def __init__(self,type,color):
        Vehicle.__init__(self,type,color)

    def get_no_of_wheels(self):
        return self.vehicleWheels

class Bus(Vehicle):
    vehicleWheels = 6

    def __init__(self,type,color):
        Vehicle.__init__(self,type,color)

    def get_no_of_wheels(self):
        return self.vehicleWheels

class Aeroplane(Vehicle):
    vehicleWheels = 7

    def __init__(self,type,color):
        Vehicle.__init__(self,type,color)

    def get_no_of_wheels(self):
        return self.vehicleWheels

class Ship(Vehicle):
    vehicleWheels = 0

    def __init__(self,type,color):
        Vehicle.__init__(self,type,color)

    def get_no_of_wheels(self):
        return self.vehicleWheels


class CustomVehicle(Car,Bus,Aeroplane,Ship):

    def __init__(self,type,color):
        Car.__init__(self,type,color)
        Bus.__init__(self, type, color)
        Aeroplane.__init__(self, type, color)
        Ship.__init__(self, type, color)

    def get_no_of_wheels(self):
        if super(CustomVehicle,self).get_no_of_wheels() == 4:
            print("Car")
        elif super(CustomVehicle, self).get_no_of_wheels() == 6:
            print("Bus")
        elif super(CustomVehicle, self).get_no_of_wheels() == 7:
            print("Aeroplane")
        elif super(CustomVehicle, self).get_no_of_wheels() == 0:
            print("Ship")

        else:
            print "..........."


c1 = CustomVehicle("land","red")
c1.get_no_of_wheels()

c2 = CustomVehicle("land","red")
c2.get_no_of_wheels()

c3 = CustomVehicle("air","red")
c3.get_no_of_wheels()

c4 = CustomVehicle("sea","red")
c4.get_no_of_wheels()