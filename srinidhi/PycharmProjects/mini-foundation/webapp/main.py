"""Only user inputs with predefined list of choices."""

from manager import *
from datetime import date
from event import *


class Main(object):

    def display(self, event_instance):
        print "Name : ", event_instance.get_name()
        print "Date : ", event_instance.get_date()
        print "City : ", event_instance.get_city()
        print "Info : ", event_instance.get_info()

    def run(self):
        manager_instance = Manager()
        while 1:
            print "\n1: add_event  2: read_event  3: update_event  4: delete_event  5: upcoming_and_completed events " \
                  "6: list_event_by_date_or_by_city  7: list_events_in_date_range  8: Exit"

            choice = int(raw_input("choice:"))

            if choice == 1:
                event_instance = Event(raw_input("enter event name :"),
                                       str(date(int(raw_input("enter year(yyyy) :")),
                                                int(raw_input("enter month(mm) :")),
                                                int(raw_input("enter day(dd) :")))),
                                       raw_input("enter city :"),
                                       raw_input("enter info :")
                                       )

                message = manager_instance.add_event(event_instance)
                print("Use this id:{} for future purposes.".format(message))

            elif choice == 2:
                event_id = raw_input("enter the event id :")
                event_instance = manager_instance.read_event_by_id(event_id)
                if event_instance == event_id:
                    print("{} id doesn't exist".format(event_instance))
                else:
                    m.display(event_instance)

            elif choice == 3:
                message = manager_instance.update_event_by_id(raw_input("enter the event id :"),
                                                              raw_input("enter the key to be changed :"),
                                                              raw_input("enter the changes"))
                if message == 1:
                    print("Successfully updated\n")
                else:
                    print("{} id doesn't exist".format(message))

            elif choice == 4:
                message = manager_instance.delete_event_by_id(raw_input("enter the event id :"))
                if message == 1:
                    print("Successfully deleted\n")
                else:
                    print("{} id doesn't exist".format(message))

            elif choice == 5:
                grouped_list = manager_instance.today_upcoming_and_completed_events()

                print("Today's Event(s):")
                print("-" * 16)
                for event_id in grouped_list[0]:
                    print('')
                    event_instance = manager_instance.read_event_by_id(event_id)
                    m.display(event_instance)

                print("\nUpcoming Event(s):")
                print("-" * 17)
                for event_id in grouped_list[1]:
                    print('')
                    event_instance = manager_instance.read_event_by_id(event_id)
                    m.display(event_instance)

                print("\nPast Event(s):")
                print("-" * 13)
                for event_id in grouped_list[2]:
                    print('')
                    event_instance = manager_instance.read_event_by_id(event_id)
                    m.display(event_instance)

            elif choice == 6:
                while True:
                    print'\n1.list_by_date\n' \
                         '2.dist by city\n' \
                         '3.list by date and city\n' \
                         '4.go to previous menu'
                    choose = int(raw_input('enter the choice'))
                    if choose == 1:
                        message = manager_instance.list_event_by_date(str(date(int(raw_input("enter year(yyyy) :")),
                                                                               int(raw_input("enter month(mm) :")),
                                                                               int(raw_input("enter day(dd) :")))))

                        for event_id in message:
                            print('')
                            a = manager_instance.read_event_by_id(event_id)
                            if a == event_id:
                                print("event id {} , doesn't exist".format(event_id))
                            else:
                                m.display(a)
                    elif choose == 2:
                        city = raw_input('enter the city')
                        message = manager_instance.list_event_by_city(city)
                        for event_id in message:
                            print('')
                            a = manager_instance.read_event_by_id(event_id)
                            if a == event_id:
                                print("event id {} , doesn't exist".format(event_id))
                            else:
                                m.display(a)
                    elif choose == 3:
                        message = manager_instance.list_event_by_date_and_city(
                            str(date(int(raw_input("enter year(yyyy) :")),
                                     int(raw_input("enter month(mm) :")),
                                     int(raw_input("enter day(dd) :")))),
                            city=raw_input('enter the city')
                        )
                        for event_id in message:
                            print('')
                            a = manager_instance.read_event_by_id(event_id)
                            if a == event_id:
                                print("event id {} , doesn't exist".format(event_id))
                            else:
                                m.display(a)

                    elif choose == 4:
                        break
                    else:
                        print 'invalid choice'
                        print ''

            elif choice == 7:
                message = manager_instance.events_in_date_range(str(date(int(raw_input("enter year(yyyy) :")),
                                                                         int(raw_input("enter month(mm) :")),
                                                                         int(raw_input("enter day(dd) :")))),
                                                                str(date(int(raw_input("enter year(yyyy) :")),
                                                                         int(raw_input("enter month(mm) :")),
                                                                         int(raw_input("enter day(dd) :")))))
                for event_id in message:
                    print('')
                    a = manager_instance.read_event_by_id(event_id)
                    if a == event_id:
                        print("event id {} , doesn't exist".format(event_id))
                    else:
                        m.display(a)

            elif choice == 8:
                break

            else:
                print "Invalid choice."


if __name__ == "__main__":
    m = Main()
    m.run()
