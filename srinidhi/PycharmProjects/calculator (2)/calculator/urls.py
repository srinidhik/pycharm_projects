from django.conf.urls import url
from calculator_app.views import calc

urlpatterns = [

    url(r'^$', calc, name='calc'),
]