from django.conf.urls import url
from add_app.views import *

urlpatterns = [

    url(r'^$', home, name='home'),

    url(r'^save$', save, name='save'),

    url(r'^remove$', remove, name='remove'),

]