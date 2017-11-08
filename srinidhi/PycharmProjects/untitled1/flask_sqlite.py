from flask import Flask, render_template, request
import sqlite3 as sql

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/enternew')
def new_student():
    return render_template('student.html')


@app.route('/addrec', methods=['POST', 'GET'])
def addrec():
    if request.method == 'POST':

        nm = request.form['nm']
        add = request.form['add']
        city = request.form['city']
        pin = request.form['pin']
        return render_template("list.html", name=nm, addr=add, city=city, pin=pin)
        #msg = "Record successfully added"
        #return render_template("list.html", msg=msg)
'''
        with sql.connect("database.db") as con:
            try:
                nm = request.form['nm']
                addr = request.form['add']
                city = request.form['city']
                pin = request.form['pin']


                cur = con.cursor()

                cur.execute("INSERT INTO students (name,addr,city,pin) VALUES(?, ?, ?, ?)",(nm,addr,city,pin) )

                con.commit()
                msg = "Record successfully added"
            except:
                con.rollback()
                msg = "error in insert operation"

            finally:
                return render_template("result.html", msg=msg)
        con.close()


@app.route('/list', methods = ['POST', 'GET'])
def list():
    if request.method == 'POST':
        nm = request.form['nm']
        addr = request.form['add']
        city = request.form['city']
        pin = request.form['pin']
        return render_template("list.html",name = nm, addr = addr, city = city, pin = pin)

    con = sql.connect("database.db")
    con.row_factory = sql.Row

    cur = con.cursor()
    cur.execute("select * from students")

    rows = cur.fetchall()
    return render_template("list.html", rows=rows)
'''

if __name__ == '__main__':
    app.run(debug=True)