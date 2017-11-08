from django.http import HttpResponse
from django.shortcuts import render
from app.models import *

def home(request):
    return render(request, 'layout.html')


def addtask_html(request):
    return render(request, 'addtask.html')


def addtask(request):
    when = request.POST.get('when')
    what = request.POST.get('what')

    AddData.objects.create(date=when, task=what)
    return HttpResponse('added')


def view(request):
    history = AddData.objects.all()
    return render(request, 'view.html', {'data':history})


def delete_completed(request):
    t_ids = request.POST.getlist('t_ids[]')

    for i in t_ids:
        instance = AddData.objects.filter(id=i)
        instance.delete()
    return HttpResponse('deleted')


def save_completed(request):
    t_ids = request.POST.getlist('t_ids[]')

    for i in t_ids:
        instance = AddData.objects.filter(id=i)
        instance.update(status='Completed')
    return HttpResponse('saved')


def display(request):
    history = AddData.objects.all()
    return render(request, 'view2.html', {'data':history})
