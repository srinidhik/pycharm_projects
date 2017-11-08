from django.conf.urls import url
from hotel_app.views import *

urlpatterns = [

    url(r'^$', home, name='home'),

    url(r'^booking_html$', booking_html, name='booking_html'),

    url(r'^details_html$', details_html, name='details_html'),

    url(r'^booked$', booked, name='booked'),

    url(r'^display$', display, name='display'),

    url(r'^clear_history$', clear_history, name='clear_history'),

    url(r'^login_user', login_user, name='login_user'),

    url(r'^register', register, name='register'),

]