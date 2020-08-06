from django.conf.urls import patterns, url
from CustomCurtains.views import *

urlpatterns = patterns("CustomCurtains.urls",
                       url(r'^$', curtains_types_home, name='curtainsTypes'),
                       )
