
from django.conf.urls import url
from django.contrib import admin

from eventapp.views import *

admin.autodiscover()


urlpatterns =  [
                        url(r'^$', index, name='index'),

                        url(r'^add_event_html', add_event_html, name='add_event_html'),
                        url(r'^add', add, name='add'),

                        url(r'^search', search, name='search'),
                        url(r'^search_event_html', search_html, name='search_event_html'),

                        url(r'^filters_html', filter_html, name='filters_html'),

                        url(r'^date', by_date, name='by_date'),
                        url(r'^by_date_html', by_date_html, name='by_date_html'),

                        url(r'^city', by_city, name='by_city'),
                        url(r'^by_city_html', by_city_html, name='by_city_html'),

                        url(r'^datecity', by_date_and_city, name='by_date_and_city'),
                        url(r'^by_city_date_html', by_city_date_html, name='by_city_date_html'),

                        url(r'^up_and_past', up_and_past, name='up_and_past'),

                        url(r'^date_range', by_date_range, name='by_date_range'),
                        url(r'^by_daterange_html', by_daterange_html, name='by_daterange_html'),

                        url(r'^update', update, name='update'),
                        url(r'^delete', delete, name='delete'),
                        url(r'^read', read, name='read'),
                        url(r'^reader', reader, name='reader'),
                ]
