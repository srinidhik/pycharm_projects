from django.conf.urls import url
from django.conf.urls.static import static

from dict_app.views import *
from pic_dict import settings

urlpatterns = [

    url(r'^$', home, name='home'),

    url(r'^add_data$', add_data, name=add_data),

    url(r'^word$', word, name=word)

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)