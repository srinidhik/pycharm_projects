from flask import Flask, render_template
app = Flask(__name__)

@app.route('/result')
def result():
    k = dict()
    for i in range(3):
        a = raw_input("key")
        b = int(raw_input("value"))
        k.update({a:b})
    return render_template('result.html', result = k)

if __name__ == '__main__':
   app.run(debug = True)