class person:
    count=0

    def __init__(self,name,age):
        self.name=name
        self.age=age
        person.count+=1

    def take_input(self):
        self.name = raw_input()


    def display(self):
        print "My name is %s" % self.name
        print "My age is %d" % self.age


abc = person("abc",1)
abc.id = 111
abc.display()
print "My id %d" % abc.id

cde = person("cde",2)
cde.display()
hasattr(cde,'id')

aa = person("aaa",3)
getattr(aa,'name','age')

print("count ={}".format(person.count))