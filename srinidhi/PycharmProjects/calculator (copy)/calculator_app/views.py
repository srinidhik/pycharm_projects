from django.http import HttpResponse
from django.shortcuts import render

from calculator_app.models import AddData


def calc(request):
    return render(request, 'layout1.html')


def save(request):
    input_expression = request.POST.get('input')
    result = request.POST.get('result')

    AddData.objects.create(input=input_expression, output=result)

    return HttpResponse("Saved")


def clear_data(request):
    history = AddData.objects.all()
    history.delete()
    return HttpResponse("Cleared")


def display1():
    history = AddData.objects.all()

    render('display.html', {'data': history})

