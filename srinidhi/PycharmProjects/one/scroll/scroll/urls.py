from django.conf.urls import patterns, include, url

from scroll_app.views import *

urlpatterns = [

    url(r'^$', home, name=home)
]