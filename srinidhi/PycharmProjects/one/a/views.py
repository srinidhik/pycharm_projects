from flask import render_template


def home():
    return render_template('layout.html')