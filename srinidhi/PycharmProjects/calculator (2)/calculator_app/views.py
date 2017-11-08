from django.shortcuts import render


def calc(request):
    return render(request, 'layout.html')


def save(request):
    first = request.POST.get('first')
    second = request.POST.get('second')
