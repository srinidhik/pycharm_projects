from abc import ABCMeta, abstractmethod

PI=3.14

class Shape(object):

    def __init__(self):
        self.properties = {}

    def print_properties(self):
        print self.properties

    def get_property(self,key):
        return self.properties[key]

    def set_property(self,key,val):
        self.properties[key] = val

#######################################################
#2DShape class

class TwoDShape(Shape):

    @abstractmethod
    def get_area(self):
        pass

########### TRIANGLE  ##############

class Triangle(TwoDShape):

    def __init__(self,height,base):
        super(Triangle,self).__init__()
        self.height=height
        self.base=base
        super(Triangle,self).set_property('height',self.height)
        super(Triangle,self).set_property('base',self.base)


    def get_area(self):
        a = super(Triangle,self).get_property('height')
        b = super(Triangle,self).get_property('base')
        area = (0.5 * a * b)
        super(Triangle, self).set_property('area', area)
        return area

###########  SQUARE  ###############

class Square(TwoDShape):

    def __init__(self,side):
        super(Square,self).__init__()
        self._side=side
        super(Square,self).set_property('side',self._side)

    def get_area(self):
        a = super(Square,self).get_property('side')
        area = (a * a)
        super(Square, self).set_property('area', area)
        return area

######## CIRCLE  ############

class Circle(TwoDShape):

    def __init__(self,radius):
        super(Circle,self).__init__()
        self._radius=radius
        super(Circle,self).set_property('radius',self._radius)

    def get_area(self):
        r = super(Circle,self).get_property('radius')
        _area = (PI * r * r)
        super(Circle, self).set_property('area', _area)
        return _area

###########################################################
#3DShape class

class ThreeDShape(Shape):

    @abstractmethod
    def get_area(self):
        pass

    @abstractmethod
    def get_volume(self):
        pass

############  CYLINDER  ##############

class Cylinder(ThreeDShape):

    def __init__(self,height,radius):
        super(Cylinder,self).__init__()
        self._height = height
        self._radius = radius
        super(Cylinder,self).set_property('height',self._height)
        super(Cylinder,self).set_property('radius',self._radius)

    def get_area(self):
        h = super(Cylinder, self).get_property('height')
        r = super(Cylinder, self).get_property('radius')
        _sa = (2 * PI * r * h) + (2 * PI * r * r)
        super(Cylinder, self).set_property('area', _sa)
        return _sa

    def get_volume(self):
        h = super(Cylinder, self).get_property('height')
        r = super(Cylinder, self).get_property('radius')
        _volume = (PI * r * r * h)
        super(Cylinder, self).set_property('volume', _volume)
        return _volume

############  CUBE  #############

class Cube(ThreeDShape):

    def __init__(self,side):
        super(Cube,self).__init__()
        self._side = side
        super(Cube,self).set_property('side',self._side)

    def get_area(self):
        s = super(Cube, self).get_property('side')
        _sa = (6 * s * s)
        super(Cube, self).set_property('area', _sa)
        return _sa

    def get_volume(self):
        s = super(Cube, self).get_property('side')
        _volume = (s * s * s)
        super(Cube, self).set_property('volume', _volume)
        return _volume

###########  SPHERE  ##########

class Sphere(ThreeDShape):

    def __init__(self,radius):
        super(Sphere,self).__init__()
        self._radius = radius
        super(Sphere,self).set_property('radius',self._radius)

    def get_area(self):
        r = super(Sphere, self).get_property('radius')
        _sa = (4 * PI * r * r)
        super(Sphere, self).set_property('area', _sa)
        return _sa

    def get_volume(self):
        r = super(Sphere, self).get_property('radius')
        _volume = ((4 * PI * r * r * r)/3)
        super(Sphere, self).set_property('volume', _volume)
        return _volume

##############################

s1=Triangle(5,4)
s=Shape
print "", s1.get_area()
s.print_properties(s1)

s2=Square(5)
print "", s2.get_area()
s.print_properties(s2)

s3=Circle(10)
print "", s3.get_area()
s.print_properties(s3)

s4=Cylinder(5,4)
print "", s4.get_area()
print "%.2f" % s4.get_volume()
s.print_properties(s4)

s5=Cube(4)
print "", s5.get_area()
print "%.2f" % s5.get_volume()
s.print_properties(s5)

s6=Sphere(4)
print "", s6.get_area()
print "%.2f" % s6.get_volume()
s.print_properties(s6)
