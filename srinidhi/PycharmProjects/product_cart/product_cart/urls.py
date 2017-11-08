from django.conf.urls import url
from product_app.views import *

urlpatterns = [

    url(r'^$', home, name='home'),

    url(r'^select_product', select_product, name='select_product'),

    url(r'^place_order', place_order, name='place_order'),

    url(r'^ordered', ordered, name='ordered'),

    url(r'^display_html', display_html, name='display_html'),

    url(r'^pic_html', pic_html, name='pic_html'),

    url(r'^image_html', image_html, name='image_html'),

    url(r'^clear_history', clear_history, name='clear_history'),

    url(r'^angularjs', angularjs, name='angularjs'),

    url(r'^select_a', select_a, name='select_a'),

    url(r'^place_order_a', place_order_a, name='place_order_a'),

    url(r'^display_a', display_a, name='display_a'),

    url(r'^form', form, name='form'),

    url(r'^',angularjs)


]
