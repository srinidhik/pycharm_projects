from flask import Flask, redirect, url_for
app = Flask(__name__)


#@app.add_url_rule('/', 'hello')
@app.route('/hello/')
def hello_world():
   return 'hello world !!!!!'


@app.route('/blog/<int:postID>')
def show_blog(postID):
   return 'Blog Number %d' % postID

@app.route('/rev/<float:revNo>')
def revision(revNo):
   return 'Revision Number %f' % revNo

@app.route('/redirect/<name>')
def redirecting_function(name):
   if name == 'blog':
      return redirect(url_for('show_blog',postID = 10))
   elif name == 'rev':
      return redirect(url_for('revision', revNo=10))
   else:
      return "in redirecting function %s" % name

if __name__ == '__main__':
   app.run(debug = True)