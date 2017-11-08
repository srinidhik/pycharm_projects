from flask_wtf import Form
from wtforms import TextField, IntegerField, TextAreaField, SubmitField, RadioField, SelectField

from wtforms import validators, ValidationError


class ContactForm(Form):
    name = TextField("Name Of Student", [validators.DataRequired("Please enter your name.")])
    Gender = RadioField('Gender', choices=[('M', 'Male'), ('F', 'Female')])
    Address = TextAreaField("Address",[validators.DataRequired("Please enter your address.")])

    email = TextField("Email", [validators.DataRequired("Please enter your email address.")])
    Age = IntegerField("age")
    language = SelectField('Languages', choices=[('cpp', 'C++'),('py', 'Python')])
    submit = SubmitField("Send")