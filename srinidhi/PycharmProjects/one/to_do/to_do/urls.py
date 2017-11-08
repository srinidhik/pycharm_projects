from django.conf.urls import url
from app.views import *

urlpatterns = [

    url(r'^$', home, name='home'),

    url(r'^addtask_html$', addtask_html, name='addtask_html'),

    url(r'^addtask$', addtask, name='addtask'),

    url(r'^view$', view, name='view'),

    url(r'^delete_completed$', delete_completed, name='delete_completed'),

    url(r'^save_completed$', save_completed, name='save_completed'),

    url(r'^display$', display, name='display'),

]