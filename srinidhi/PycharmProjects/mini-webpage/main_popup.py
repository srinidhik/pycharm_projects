from flask import Flask, render_template, request

app = Flask(__name__)
app.secret_key = 'some_secret'



@app.route('/popup')
def popup():
    return render_template("popup.html")


@app.route('/resultofpop', methods=["POST", "GET"])
def popup():
    if request.method=="POST":
        message = request.form["city"]
        return render_template('popup_result.html', message=message)


if __name__ == "__main__":
    app.run(debug = True)