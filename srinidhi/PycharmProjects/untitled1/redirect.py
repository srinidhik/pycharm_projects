from flask import Flask, redirect, url_for

app = Flask(__name__)

@app.route('/')
def hello():
    return redirect(url_for('foo'))

@app.route('/foo')
def foo():
    return 'Hello Foo!'

if __name__ == '__main__':
    app.run()