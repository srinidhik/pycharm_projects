import datetime

from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import render, HttpResponseRedirect
from hotel_app.models import *


def home(request):
    return render(request, 'layout.html')


def booking_html(request):
    return render(request, 'select_hotel.html', {'data': Hotel.objects.all()})


def details_html(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        new_name = request.POST.get('new_name')
        new_rent = request.POST.get('new_rent')

        if name == 'other':
            Hotel.objects.create(HotelName=new_name, Amount=new_rent)
            name = new_name

        instance = Hotel.objects.get(HotelName=name)
        return render(request, 'booking.html', {'instance': instance, 'hotel_result': 'hotel_result'})


def booked(request):
    if request.method == 'POST':
        from_date = request.POST.get('from_date')
        to_date = request.POST.get('to_date')
        persons = request.POST.get('persons')
        rent = request.POST.get('rent')
        hotel_info = request.POST.get('hotel_info')

        date1 = datetime.datetime.strptime(to_date, '%Y-%m-%d')
        date2 = datetime.datetime.strptime(from_date, '%Y-%m-%d')

        if date1 == date2:
            days = 1

        else:
            days = (date1 - date2).days

        amount = int(days) * int(persons) * int(rent)

        Details.objects.create(FromDate=from_date, ToDate=to_date, NoOfPersons=persons, NoOfDays=days, TotalAmount=amount, HotelInfo_id=hotel_info)

        message = "Total Amount = {}".format(amount)

        return HttpResponse(message)


def display(request):
    history = Details.objects.all()
    rates =[obj.TotalAmount for obj in history]
    total = sum(rates)
    return render(request, 'display.html', {'data': history, 'total': total})


def clear_history(request):
    history = Details.objects.all()
    history.delete()
    return HttpResponseRedirect(reverse('home'), {'clear': "cleared"})


def register(request):
    username = request.POST.get('username')
    password = request.POST.get('password')

    Login.objects.create(username=username, password=password)

    return HttpResponse("Successfully Added")


def login_user(request):
    username = request.POST.get('username')
    password = request.POST.get('password')

    user_instance = Login.objects.filter(username=username, password=password)
    if user_instance:
        return HttpResponse("Existing")
    else:
        return HttpResponse("Non existing user")

