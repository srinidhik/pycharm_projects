from django.http import HttpResponse
from django.shortcuts import render
from product_app.models import *


def counting():
    history = AddCart.objects.all()
    count = [obj.quantity for obj in history]
    cart_count = len(count)
    return cart_count


def home(request):
    cart_count = counting()
    return render(request, 'layout.html', {'cart_count': cart_count})



def select_product(request):
    cart_count = counting()
    return render(request, 'select_product.html', {'data': AddProduct.objects.all(), 'cart_count': cart_count})


def place_order(request):
    cart_count = counting()
    name = request.POST.get('product')

    instance = AddProduct.objects.get(name=name)

    return render(request, 'place_order.html', {'instance': instance, 'cart_count': cart_count})


def ordered(request):
    if request.method == 'POST':
        product_name = request.POST.get('product_name')
        product_rate = request.POST.get('product_rate')
        quantity = request.POST.get('quantity')
        
        amount = int(product_rate) * int(quantity)
        AddCart.objects.create(product_name_id=product_name, quantity=quantity, amount=amount)

        message = "Total amount = {}".format(amount)

        return HttpResponse(message)




def display_html(request):
    cart_count = counting()
    history = AddCart.objects.all()
    rates_list = [obj.amount for obj in history]
    total = sum(rates_list)
    return render(request, 'display.html', {'data': history, 'total': total, 'cart_count': cart_count})


def pic_html(request):
    cart_count = counting()
    data = [obj for obj in AddProduct.objects.all()]
    return render(request, 'pic.html', {'data': data, 'cart_count':cart_count})


def image_html(request):
    cart_count = counting()
    data = AddProduct.objects.all()
    data1 = data[0]
    data2 = data[1]
    data3 = data[2]
    return render(request, 'product_image.html', {'data1':data1, 'data2':data2, 'data3':data3, 'cart_count':cart_count})


def clear_history(request):
    AddCart.objects.all().delete()
    return HttpResponse("cleared")


def angularjs(request):
    cart_count = counting()
    data = AddProduct.objects.all()
    l = []
    for i in data:
        l.append(str(i.name))
    return render(request, 'layout_a.html', {'data1': l, 'cart_count': cart_count})


def form(request):
    return render(request, 'form1.html')


def select_a(request):
    cart_count = counting()
    data = AddProduct.objects.all()
    l = []
    for i in data:
        l.append(str(i.name))
    return render(request, 'select_a.html', {'data1': l, 'cart_count': cart_count})


def place_order_a(request):
    cart_count = counting()
    name = request.POST.get('product')

    instance = AddProduct.objects.get(name=name)

    return render(request, 'place_order_a.html', {'name': instance.name, 'amount': instance.rate, 'cart_count': cart_count})



def display_a(request):
    cart_count = counting()
    history = AddCart.objects.all()
    complete_data = []
    n=[]
    for i in history:
        complete_data.append([str(i.product_name_id), str(i.quantity), str(i.amount)])
        n.append(str(i.product_name_id))
    rates_list = [obj.amount for obj in history]
    total = sum(rates_list)
    return render(request, 'display_a.html', {'complete_data': complete_data, 'name': n, 'total': total, 'cart_count': cart_count})
