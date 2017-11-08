from django.conf.urls import url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from event_app.views import *

admin.autodiscover()

urlpatterns = [
    url(r'^$', index, name='index'),
    url(r'^add_event_html', add_event_html, name='add_event_html'),
    url(r'^add', add, name='add'),
    url(r'^filters_html$', filter_html, name='filters_html'),
    url(r'^by_date_html', by_date_html, name='by_date_html'),
    url(r'^by_city_html', by_city_html, name='by_city_html'),
    url(r'^by_city_date_html', by_city_date_html, name='by_city_date_html'),
    url(r'^up_and_past', up_and_past, name='up_and_past'),
    url(r'^by_date_range_html', by_date_range_html, name='by_date_range_html'),
    url(r'^by_date$', by_date, name='by_date'),
    url(r'^by_city', by_city, name='by_city'),
    url(r'^by_date_and_city', by_date_and_city, name='by_date_and_city'),
    url(r'^by_date_range$', by_date_range, name='by_date_range'),
    url(r'^read', read, name='read'),
    url(r'^reader', reader, name='reader'),

    url(r'^search_html', search_html, name='search_html'),
    url(r'^search$', search),
    url(r'^delete$', delete),
    url(r'^update$', update)

]
