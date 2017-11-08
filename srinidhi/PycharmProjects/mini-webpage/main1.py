from flask import Flask, render_template, request
from event import *
from manager import *

app = Flask(__name__)
manager_instance = Manager()

@app.route("/")
def addevent():
    return render_template("add_event.html")

@app.route("/add_event", methods = ['POST', 'GET'])
def addeventmethod():
    if request.method == 'POST':
        event_instance = Event(request.form["name"],
                               request.form["date"],
                               request.form["city"],
                               request.form["info"])
        event_id = manager_instance.add_event(event_instance)
        message = "Save Event ID: {}".format(event_id)
        return render_template("get_id.html", message = message)

if __name__ == "__main__":
    app.run(debug = True)
