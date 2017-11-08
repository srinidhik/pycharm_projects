from django.http import HttpResponse
from django.shortcuts import render
from operator import itemgetter

from manager import *
from event import *

manager_instance = Manager()


def get_data():
    response = JsonHandler().load_file()
    return response



def index(request):
    return render(request, 'layout.html', {})



def add_event_html(request):
    return render(request, "add_event.html", {'data': get_data()})



def add(request):
    data = get_data()
    name = request.POST.get('name')
    date = request.POST.get('date')
    city = request.POST.get('cities')
    if city:
        city = city.capitalize()
    if city == 'Other':
        city = request.POST.get('city1').capitalize()
    info = request.POST.get('info')
    if city not in data["cities"]:
        data["cities"].append(city)
    manager_instance.update_city(data["cities"])
    event_instance = Event(name, date, city, info)
    manager_instance.add_event(event_instance)
    message = "Event added!"
    return HttpResponse(message)



def search_html(request):
    return render(request, "search_modify.html", {'data': get_data()})


def filter_html(request):
    return render(request, "filters.html", {'data': get_data()})



def by_date_html(request):
    return render(request, "list_by_date.html", {'data': get_data()})



def by_city_html(request):
    return render(request, "list_by_city.html", {'data': get_data()})


def by_city_date_html(request):
    return render(request, "list_by_city_date.html", {'data': get_data()})


def search(request):
    if request.method == 'POST':
        eid = request.POST['event_name']
        if eid != "default":
            event_instance = manager_instance.read_event_by_id(eid)
            if eid in get_data():
                return render(request, 'search_result.html', {'instance': event_instance, 'id': eid, 'data': get_data()})
        else:
            return HttpResponse("please select a name from list!")



def update(request):
    data = get_data()
    upd_name = request.POST.get("upd_name")
    upd_date = request.POST.get("upd_date")
    upd_city = request.POST.get("upd_city")
    if upd_city:
        upd_city.capitalize()
    upd_info = request.POST.get("upd_info")
    eid = request.POST.get("id")

    if upd_city not in data["cities"]:
        data["cities"].append(upd_city)
    manager_instance.update_city(data["cities"])
    temp_dict = {"name": upd_name, "date": upd_date, "city": upd_city, "info": upd_info}
    message = manager_instance.update_event_by_id(eid, temp_dict)
    return HttpResponse(message)



def delete(request):
    eid = request.POST["id"]
    data_from_json = get_data()
    if eid in data_from_json:
        message = manager_instance.delete_event_by_id(eid)
    return HttpResponse(message)





def by_date(request):
    if request.method == 'POST':
        a = manager_instance.list_event_by_date(request.POST.get('date'))
        if not a:
            return HttpResponse('no event found')
        else:
            message = ','.join(a)
            d = read(request, message)
            return render(request, 'read.html', {'d': d})



def by_city(request):
    if request.method == 'POST':
        a = manager_instance.list_event_by_city(request.POST.get('city'))
        if not a:
            return HttpResponse('no event found')
        else:
            message = ','.join(a)
            d = read(request, message)
            return render(request, 'read.html', {'d': d})



def by_date_and_city(request):
    if request.method == 'POST':
        a = manager_instance.list_event_by_date_and_city(request.POST.get('date'), request.POST.get('city'))
        if not a:
            return HttpResponse('no event found')
        else:
            message = ','.join(a)
            d = read(request, message)
            return render(request, 'read.html', {'d': d})


def by_date_range_html(request):
    return render(request, "list_by_daterange.html", {'data': get_data()})


def by_date_range(request):
    if request.method == 'POST':
        date1 = request.POST.get('date1')
        date2 = request.POST.get('date2')
        a = manager_instance.events_in_date_range(date1, date2)

        print a
        if a==[]:
            return HttpResponse('no event found')
        else:
            message = ','.join(a)
            d = read(request, message)
            return render(request, 'read.html', {'d': d})



def up_and_past(request):
    a = manager_instance.today_upcoming_and_completed_events()
    message1 = ','.join(a[0])
    message2 = ','.join(a[1])
    message3 = ','.join(a[2])
    b = [message1, message2, message3]
    message = '.'.join(b)
    d = reader(request, message)
    return render(request, 'result.html', {'d1': d[0], 'd2': d[1], 'd3': d[2]})



def read(request, list_of_event_ids):
    a = list_of_event_ids
    list_of_event_ids = a.split(',')
    storage = {}

    if a != '':
        for id in list_of_event_ids:
            x = manager_instance.read_event_by_id(id)
            if x == id:
                return 'id {} does not exist'.format(id)
            else:
                storage.update({id: x.__dict__})

    d = sorted(storage.items(), key=itemgetter(1), reverse=True)
    for i in range(len(d) - 1, 0, -1):
        for j in range(0, i, 1):
            if d[i][1]['date'] < d[j][1]['date']:
                d[i], d[j] = d[j], d[i]

    return d



def reader(request, list_of_event_ids):
    a = list_of_event_ids
    b = a.split('.')
    storage = {}

    if b[0] != '':
        list_of_event_ids = b[0].split(',')
        for id in list_of_event_ids:
            x = manager_instance.read_event_by_id(id)
            storage.update({id: x.__dict__})

    d1 = sorted(storage.items(), key=itemgetter(1), reverse=True)
    for i in range(len(d1) - 1, 0, -1):
        for j in range(0, i, 1):
            if d1[i][1]['date'] < d1[j][1]['date']:
                d1[i], d1[j] = d1[j], d1[i]

    storage1 = {}
    if b[1] != '':
        list_of_event_ids = b[1].split(',')
        for id in list_of_event_ids:
            x = manager_instance.read_event_by_id(id)
            storage1.update({id: x.__dict__})

    d2 = sorted(storage1.items(), key=itemgetter(1), reverse=True)
    for i in range(len(d2) - 1, 0, -1):
        for j in range(0, i, 1):
            if d2[i][1]['date'] < d2[j][1]['date']:
                d2[i], d2[j] = d2[j], d2[i]

    storage2 = {}
    if b[2] != '':
        list_of_event_ids = b[2].split(',')
        for id in list_of_event_ids:
            x = manager_instance.read_event_by_id(id)
            storage2.update({id: x.__dict__})

    d3 = sorted(storage2.items(), key=itemgetter(1), reverse=True)
    for i in range(len(d3) - 1, 0, -1):
        for j in range(0, i, 1):
            if d3[i][1]['date'] < d3[j][1]['date']:
                d3[i], d3[j] = d3[j], d3[i]

    return [d1, d2, d3]
