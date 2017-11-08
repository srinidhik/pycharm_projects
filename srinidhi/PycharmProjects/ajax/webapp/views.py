from webapp import app
from collections import OrderedDict
from operator import itemgetter
from pickle import GET

from flask import render_template, redirect, url_for, request
from manager import *
from event import *

manager_instance = Manager()


def get_data():
    response = JsonHandler().load_file()
    return response

@app.route('/')
def index():
    return render_template('layout.html', data=get_data())

@app.route('/add_event_html')
def add_event():
    return render_template('add_event.html',data=get_data())

@app.route('/search_event_html')
def search_modify():
    return render_template('search_modify.html',data=get_data())

@app.route('/add', methods=["POST"])
def add():
    data = get_data()
    name = request.form['name']
    date = request.form['date']
    city = request.form['city'].capitalize()
    if city=='Other':
        city=request.form['city1'].capitalize()
    info = request.form['info']
    if city not in data["cities"]:
        data["cities"].append(city)
    manager_instance.update_city(data["cities"])
    event_instance = Event(name, date, city, info)
    message = manager_instance.add_event(event_instance)
    return redirect(url_for("index"))

@app.route('/search', methods=['POST', 'GET'])
def search():
    if request.method == 'POST':
        eid = request.form['event_name']
        if eid != "default":
            data_from_json = JsonHandler.load_file(JsonHandler())
            event_instance = manager_instance.read_event_by_id(eid)
            if eid in data_from_json:
                return render_template('search_result.html', instance=event_instance, id=eid, data=data_from_json)
        else:
            return "please select a name from list!"

@app.route("/update", methods=["POST"])
def update():
    data=get_data()
    upd_name = request.form["upd_name"]
    upd_date = request.form["upd_date"]
    upd_city = request.form["upd_city"].capitalize()
    if upd_city == 'Other':
        upd_city = request.form['cities'].capitalize()
    upd_info = request.form["upd_info"]
    eid = request.form["id"]
    if upd_city not in data["cities"]:
        data["cities"].append(upd_city)
    manager_instance.update_city(data["cities"])
    temp_dict = {"name":upd_name,"date":upd_date, "city":upd_city, "info":upd_info}
    message = manager_instance.update_event_by_id(eid, temp_dict)
    if message == 1:
        return redirect(url_for("index"))
    else:
        return message


@app.route('/delete', methods=["POST"])
def delete():
    eid = request.form["id"]
    data_from_json = JsonHandler.load_file(JsonHandler())
    if eid in data_from_json:
        messsage = manager_instance.delete_event_by_id(eid)
        if messsage == 1:
            return redirect(url_for("index"))
        else:
            return "id doesn't exist"


@app.route('/filters_html')
def filters():
    return render_template('filters.html',data=get_data())












@app.route('/by_date_html')
def by_date_html():
    return render_template('list_by_date.html',data=get_data())


@app.route('/by_date', methods=['POST'])
def by_date():
    if request.method == 'POST':
        a = manager_instance.list_event_by_date(request.form['date'])
        if a == []:
            return 'no event found'
        else:
            message = ','.join(a)
            return redirect(url_for('read', list_of_event_ids=message))

















@app.route('/by_city_html')
def by_city_html():
    return render_template('list_by_city.html',data=get_data())


@app.route('/by_city', methods=['POST', 'GET'])
def by_city():
    if request.method == 'POST':
        a = manager_instance.list_event_by_city(request.form['city'])
        if a==[]:
            return 'no event found'
        else:
            message = ','.join(a)
            return redirect(url_for('read', list_of_event_ids=message))

@app.route('/by_city_date_html')
def by_city__date_html():
    return render_template('list_by_city_date.html',data=get_data())


@app.route('/by_date_and_city', methods=['POST', 'GET'])
def by_date_and_city():
    if request.method == 'POST':
        a = manager_instance.list_event_by_date_and_city(request.form['date'], request.form['city'])
        if a == []:
            return 'no event found'
        else:
            message = ','.join(a)
            return redirect(url_for('read', list_of_event_ids=message))

@app.route('/by_daterange_html')
def by_daterange_html():
    return render_template('list_by_daterange.html',data=get_data())



@app.route('/by_daterange', methods=['POST', 'GET'])
def by_daterange():
    if request.method == 'POST':
        a = manager_instance.events_in_date_range(request.form['fromdate'], request.form['todate'])
        if a == []:
            return 'no event found'
        else:
            message = ','.join(a)
            return redirect(url_for('read', list_of_event_ids=message))


@app.route('/up_and_past_html')
def up_and_past_html():
    return render_template('up_and_past.html',data=get_data())


@app.route('/up_and_past')
def up_and_past():
    a = manager_instance.today_upcoming_and_completed_events()
    message1 = ','.join(a[0])
    message2 = ','.join(a[1])
    message3 = ','.join(a[2])
    b = [message1, message2, message3]
    message = '.'.join(b)
    return redirect(url_for('reader', list_of_event_ids=message))

@app.route('/read')
def read():
    a = request.args['list_of_event_ids']
    list_of_event_ids = a.split(',')
    storage = {}

    if a != '':
        for id in list_of_event_ids:
            x = manager_instance.read_event_by_id(id)
            if x==id:
                return 'id {} does not exist'.format(id)
            else:
                storage.update({id: x.__dict__})

    d = sorted(storage.items(), key=itemgetter(1), reverse=True)
    for i in range(len(d)-1, 0, -1):
        for j in range(0,i,1):
            if d[i][1]['date'] < d[j][1]['date']:
                d[i], d[j] = d[j], d[i]

    return render_template('read.html', d=d, length = len(d))


@app.route('/reader')
def reader():
    a = request.args['list_of_event_ids']
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
    if b[1]!='':
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

    return render_template('result.html', d1=d1,d2=d2,d3=d3,l1=len(d1),l2=len(d2),l3=len(d3))



