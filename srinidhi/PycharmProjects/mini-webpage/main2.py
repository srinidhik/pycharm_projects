from flask import Flask, render_template, request, url_for, redirect, flash, session
from event import *
from manager import *

app = Flask(__name__)
app.secret_key = 'some_secret'

manager_instance = Manager()
json_instance = JsonHandler()


@app.route('/reader')
def read():
    a = request.args['event_id_list']
    event_id_list = a.split(',')
    storage = {}
    for id in event_id_list:
        a = manager_instance.read_event_by_id(id)
        event_instance = a.__dict__
        storage.update({id: event_instance})
    return render_template("read.html", storage=storage)


@app.route("/")
def home():
    return render_template("home.html")

@app.route("/add_event", methods = ['POST', 'GET'])
def addeventmethod():

    if request.method == 'POST':
        event_instance = Event(request.form["nam"],
                               request.form["date"],
                               request.form["city"],
                               request.form["info"])
        event_id = manager_instance.add_event(event_instance)
        message = "Save Event ID: {}".format(event_id)
        #flash(message)
        return redirect(url_for('addeventmethod'))

    return render_template('home.html')

@app.route("/search", methods = ['POST', 'GET'])
def searchmethod():
    if request.method == 'POST':
        event_id = request.form["event_id"]
        return redirect(url_for('read', event_id_list=event_id))

'''     name = event_instance.get_name()
        city = event_instance.get_city()
        date = event_instance.get_date()
        info = event_instance.get_info()
        message = "Name = {name}, City = {city}, Date = {date}, Info = {info}".format(name=name, city=city, date=date,info=info)
        flash(message)
        return redirect(url_for('home'))
    return render_template("home.html")
'''

@app.route("/reading")
def listt():
    a = ['329a3e8d-087e-400c-9df2-bd47ed5f84e3', 'd226e933-546e-436b-a0e1-49532b69a2c5']
    event_id_list = ','.join(a)
    return redirect(url_for('read', event_id_list=event_id_list))

@app.route("/delete", methods = ['POST', 'GET'])
def deletemethod():
    if request.method == 'POST':
        event_id = request.form["event_id"]
        message = manager_instance.delete_event_by_id(event_id)
        if message == 1:
            msg = "Successfully deleted"
        else:
            msg = "{} id doesn't exist".format(message)
        return render_template("home.html", message = msg)

@app.route("/update", methods = ['POST', 'GET'])
def updatemethod():
    if request.method == 'POST':
        message = manager_instance.update_event_by_id(request.form["event_id"],
                                                      request.form["key"],
                                                      request.form["value"])
        if message == 1:
            msg = "Successfully updated"
        else:
            msg = "{} id doesn't exist".format(message)
        return render_template("home.html", message=msg)

@app.route("/by_date_range", methods = ["POST","GET"])
def indaterange():
    if request.method == "POST":
        message = manager_instance.events_in_date_range(request.form["date1"],
                                                      request.form["date2"])

        event_id_list = ','.join(message)
        return redirect(url_for('read', event_id_list=event_id_list))


@app.route('/display')
def display():
    storage = json_instance.load_file()
    return render_template("display.html", storage = storage)



if __name__ == "__main__":
    app.run(debug = True)