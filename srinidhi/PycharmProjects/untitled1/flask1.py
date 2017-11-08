from flask import Flask
hello = Flask(__name__)

@hello.route('/<name>')
def hello_world(name):
    return name

'''
@hello.route('/hello')
def hello_world():
    l = ""
    for i in range(1, 11):
        l += "hello world !!! "
    return l
'''

if __name__ == "__main__":
    hello.run(debug = True)
