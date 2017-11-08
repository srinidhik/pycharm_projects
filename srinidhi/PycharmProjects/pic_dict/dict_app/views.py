from django.http import HttpResponse
from django.shortcuts import render
from dict_app.models import AddData


def home(request):
    return render(request, 'layout.html')


def add_data(request):
    if request.method == 'POST':
        letter = request.POST.get('letter').capitalize()
        wording = request.POST.get('word').capitalize()
        img = request.POST.get('photo')



        history = AddData.objects.all()
        letter_list = [obj.letter for obj in history]
        if letter in letter_list:
            instance = AddData.objects.get(letter=letter)
            AddData.objects.filter(id=instance.id).update(letter=letter, word=wording, picture=img)
        else:
            AddData.objects.create(letter=letter, word=wording, picture=img)

        return HttpResponse('Added')


def word(request):
    letter = request.POST.get('letter')

    instance = AddData.objects.get(letter=letter)

    return render(request, 'show.html', {'data':instance})

    '''return HttpResponse(instance.word)'''


