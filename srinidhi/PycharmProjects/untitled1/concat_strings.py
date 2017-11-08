from flask import Flask, request, render_template
app = Flask(__name__)

@app.route("/concat")
def success():
    return render_template("concat1.html")

@app.route('/concatt', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        result = request.form
        return render_template("concat_answer.html", result=result)

if __name__ == "__main__":
    app.run()


            #result = request.form['nm'] + " " + request.form['num'] + " " +request.form['id']
'''
        result = []
        #list1 = ['nm','num','id']
        result.append(request.form['nm'])
        result.append(request.form['num'])
        result.append(request.form['id'])

        return render_template("concat.html",key1 = ['nm','num','id'], value = result)
'''

