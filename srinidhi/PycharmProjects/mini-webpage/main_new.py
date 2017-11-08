from flask import Flask, render_template, redirect, url_for, request
from manager import *
from event import *

app = Flask(__name__)
manager_instance = Manager()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/add', methods=["POST"])
def add():
    name = request.form['name']
    date = request.form['date']
    city = request.form['city']
    info = request.form['info']
    event_instance = Event(name, date, city, info)
    message = manager_instance.add_event(event_instance)
    return "Save this id : {}".format(message)


@app.route('/search', methods={"POST"})
def search():
    id = request.form["event_id"]
    event_instance = [manager_instance.read_event_by_id(id)]
    if event_instance == id:
        return "This ID is not available:{}".format(event_instance)
    else:
        return render_template('search_result.html', search=event_instance )


@app.route('/fetch', methods=["POST"])
def fetch():
    e_id = request.form['event id']
    event_instance = manager_instance.read_event_by_id(e_id)
    return render_template('update.html', event=event_instance, id=e_id)


@app.route("/update", methods=["POST"])
def update():
    upd_name = request.form["upd_name"]
    upd_date = request.form["upd_date"]
    upd_city = request.form["upd_city"]
    upd_info = request.form["upd_info"]
    eid = request.form["id"]
    temp_dict = {"name":upd_name,"date":upd_date, "city":upd_city, "info":upd_info}
    message = manager_instance.update_event_by_id(eid, temp_dict)
    if message == 1:
        return "Successfully updated"
    else:
        return message

@app.route('/delete', methods=["POST"])
def delete():
    id = request.form["event id"]
    message = manager_instance.delete_event_by_id(id)
    if message == 1:
        return "Successfully deleted"
    else:
        return "id doesn't exist"


@app.route('/filter', methods=["POST"])
def filter_data():
    date = request.form['date']
    city = request.form['city']
    _from = request.form['from']
    to = request.form['to']


if __name__ == '__main__':
    app.run()