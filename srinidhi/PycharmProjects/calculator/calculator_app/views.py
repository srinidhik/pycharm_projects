from django.http import HttpResponse
from django.shortcuts import render

from calculator_app.models import AddData


def calc(request):
    return render(request, 'layout.html')


def save(request):
    first = request.POST.get('first')
    second = request.POST.get('second')
    result =  request.POST.get('result')
    symbol = str(request.POST.get('symbol'))

    if (symbol == '11'):
        input = first + '+' + second
        AddData.objects.create(input=input, output=result)
        return HttpResponse("Saved")

    elif (symbol == '12'):
        input = first + '-' + second
        AddData.objects.create(input=input, output=result)
        return HttpResponse("Saved")

    elif (symbol == '13'):
        input = first + '*' + second
        AddData.objects.create(input=input, output=result)
        return HttpResponse("Saved")

    elif (symbol == '14'):
        input = first + '/' + second
        AddData.objects.create(input=input, output=result)
        return HttpResponse("Saved")

    elif (symbol == '15'):
        input = first + '%' + second
        AddData.objects.create(input=input, output=result)
        return HttpResponse("Saved")

    else:
        return HttpResponse("Not Saved")


def clear_data(request):
    history = AddData.objects.all()
    history.delete()
    return HttpResponse("Cleared")
