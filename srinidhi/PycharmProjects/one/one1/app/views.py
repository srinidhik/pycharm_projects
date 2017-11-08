from django.shortcuts import render


def home(request):
    return render(request, 'layout.html')


def one(request):
    return render(request, 'page1.html')