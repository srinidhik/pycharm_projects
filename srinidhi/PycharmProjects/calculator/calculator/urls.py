from django.conf.urls import url
from calculator_app.views import *

urlpatterns = [

    url(r'^$', calc, name='calc'),

    url(r'^save$', save, name='save'),
    url(r'^clear_data$', clear_data, name='clear_data')
]