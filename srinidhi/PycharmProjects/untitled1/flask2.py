from flask import Flask
app = Flask(__name__)


@app.route('/')
def main():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Form</title>
    <style>
    #header{
        background-color: black;
        color: white;
        text-align: center;
        padding: 5px;
    }
    #nav{
        line-height: 30px;
        background-color: lightgreen;
        font-size: 5;
        width: 100px;
        float: left;
        padding: 3px;
    }
    #section{
        background-color: lightblue;
        color: blue;
    }
    #footer{
        background-color: black;
        color: white;
        padding: 5px;
    }
    a:link {color: white; background-color: transparent; text-decoration:underline; }
    a:visited {color: white; background-color: transparent; text-decoration:underline; }
    a:active {color: white; background-color: transparent; text-decoration:underline; }
    a:hover	{color: blue; background-color: transparent; text-decoration: none; }
    </style>
    </head>
    <body>
    <h2 id="header">Application Form</h2>
    <br>

    <div id="nav">
    <a href="#Gender">Gender</a><br><a href="#Education">Education</a><br><a href="#address">Address</a>
    <br><br>
    </div>

    <legend>Personal Information:</legend>
    <fieldset id="section">

    First Name:<br> <input type="text" name="firstname" placeholder="First Name" autofocus><br><br>
    Last Name:<br> <input type="text" name="lastname" placeholder="Last Name" maxlength="10"><br><br>
    e-mail id:<br> <input type="email" name="emailid" placeholder="xxxxxxx@xxx.xxx" required><br><br>
    <abbr title="Date Of Birth">DOB</abbr>:<br>
        <input type="date" name="birthday">
    <form>
    <br><p id="Gender"></p>Gender:
        <input type="radio" name="gender" value="female" checked>FEMALE
        <input type="radio" name="gender" value="male">MALE<br><br>
    <p id="Education"></p>Education:
        <input type="checkbox" name="education" value="10th">10th
        <input type="checkbox" name="education" value="12th">12th
        <input type="checkbox" name="education" value="UG">UG
        <input type="checkbox" name="education" value="PG">PG<br>
    </form>
    <p id="address"></p>
    Address:
    <input type="text" name="address" placeholder="address"><br><br>
    City:
    <input type="city" list="city" name="cityname" placeholder="City">
    <datalist id="city">
      <option value="Hyderabad">
      <option value="Chennai">
      <option value="Banglore"><br>
    </datalist>
    State:<select>
        <option value="TS">TS</option>
        <option value="TN">TN</option>
        <option value="KAR">KAR</option>
    </select>
    <input type="text" name="pincode" pattern="[0-9]{6}" placeholder="pincode"><br><br>
    Photograph:
    <input type="file"><br>
    </fieldset>

    <button type="button" onclick="alert('extra information can be given here')"><img src="pic_bulbon.gif" alt="format" style="width:10px; height=10px; "></button>
    <textarea name="info" rows="8" cols="15"></textarea>

    <br><br>
    <input type="submit">
    <div id="footer">Completed</div>
    </body>
    </html>
    '''


if __name__ == "__main__":
    app.run(debug = True)
