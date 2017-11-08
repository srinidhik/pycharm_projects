from flask import Flask, render_template, request

app = Flask(__name__)
count = 0
result = {}

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/enternew')
def new_student():
    return render_template('student.html')


@app.route('/addrec', methods=['POST', 'GET'])
def addrec():


if __name__ == '__main__':
    app.run(debug=True)