from django.conf.urls import url, patterns


urlpatterns = patterns('',
                       url(r'^$', 'EventsApp.views.home'),
                       url(r'^add_event_h$', 'EventsApp.views.add_event_html'),
                       url(r'^add$', 'EventsApp.views.add'),
                       url(r'^search_modify_html$', 'EventsApp.views.search_modify_html', name='search_modify_html'),
                       url(r'^search$', 'EventsApp.views.search'),
                       url(r'^delete$', 'EventsApp.views.delete'),
                       url(r'^update$', 'EventsApp.views.update'),
                       url(r'^by_date_html$', 'EventsApp.views.by_date_html'),
                       url(r'^by_city_html$', 'EventsApp.views.by_city_html'),
                       url(r'^by_city_date_html', 'EventsApp.views.by_city_date_html'),
                       url(r'^up_and_past$', 'EventsApp.views.up_and_past'),
                       url(r'^by_daterange_html$', 'EventsApp.views.by_daterange_html'),
                       url(r'^by_date$', 'EventsApp.views.by_date'),
                       url(r'^by_city$', 'EventsApp.views.by_city'),
                       url(r'^by_date_and_city$', 'EventsApp.views.by_date_and_city'),
                       url(r'^by_date_range$', 'EventsApp.views.by_date_range'),
                       url(r'^read$', 'EventsApp.views.read'),
                       url(r'^reader$', 'EventsApp.views.reader', name='reader')
                       )
