from flask import Flask, render_template, request, url_for, redirect, flash, session
from event import *
from manager import *

app = Flask(__name__)
app.secret_key = 'some_secret'

manager_instance = Manager()
json_instance = JsonHandler()

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/add_event", methods = ['POST', 'GET'])
def addeventmethod():

    if request.method == 'POST':
        event_instance = Event(request.form["name"],
                               request.form["date"],
                               request.form["city"],
                               request.form["info"])
        event_id = manager_instance.add_event(event_instance)
        message = "Save Event ID: {}".format(event_id)
        flash(message)
        return redirect(url_for('addeventmethod'))

    return render_template('home.html')

@app.route("/search", methods = ['POST', 'GET'])
def searchmethod():
    if request.method == 'POST':
        event_id = request.form["event_id"]

        event_instance = manager_instance.read_event_by_id(event_id)
        return render_template('read.html', storage = {id:event_instance.__dict__})

'''     name = event_instance.get_name()
        city = event_instance.get_city()
        date = event_instance.get_date()
        info = event_instance.get_info()
        message = "Name = {name}, City = {city}, Date = {date}, Info = {info}".format(name=name, city=city, date=date,info=info)
        flash(message)
        return redirect(url_for('home'))
    return render_template("home.html")
'''


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


if __name__ == "__main__":
    app.run(debug = True)