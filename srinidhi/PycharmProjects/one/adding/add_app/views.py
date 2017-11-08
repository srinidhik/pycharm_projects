from django.shortcuts import render
from add_app.models import *


def home(request):
    history = AddData.objects.all()
    list_output = [int(obj.output) for obj in history]
    count = len(list_output)
    total = sum(list_output)
    items = []
    for i in history:
        items.append([int(i.input1), int(i.input2), int(i.input3), int(i.output), int(i.id)])
    return render(request, 'layout.html', {'count': count, 'total': total, 'items': items})


def save(request):
    input1 = request.POST.get('input1')
    input2 = request.POST.get('input2')
    input3 = request.POST.get('input3') or 0
    output = request.POST.get('output')
    AddData.objects.create(input1=input1, input2=input2, input3=input3, output=output )
    history = AddData.objects.all()
    list_output = [int(obj.output) for obj in history]
    count = len(list_output)
    total = sum(list_output)
    items = []
    for i in history:
        items.append([int(i.input1), int(i.input2), int(i.input3), int(i.output), int(i.id)])
    return render(request, 'layout.html', {'count': count, 'total': total, 'items': items})


def remove(request):
    remove_id = request.POST.get('remove_id')
    instance = AddData.objects.filter(id= remove_id)
    instance.delete()
    history = AddData.objects.all()
    list_output = [int(obj.output) for obj in history]
    count = len(list_output)
    total = sum(list_output)
    items = []
    for i in history:
        items.append([int(i.input1), int(i.input2), int(i.input3), int(i.output), int(i.id)])
    return render(request, 'layout.html', {'count': count, 'total': total, 'items': items})
