# Create your views here.
import json
import urllib
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import render
from math import ceil
from django.views.decorators.cache import never_cache
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
import tablib
import xlrd
from CartManagement.views import _add_item_to_cart
from CustomCurtains.constants import *
from CustomCurtains.utils import _convert_to_cdn
from UserManagement.staff_permissions import staffHasAccessTo
from projectcustom.settings import POPTIONS_HOST_URL, CURTAINS_HOST_URL
from rest_framework.views import APIView
from CartManagement.views import _add_item_to_cart


def curtains_types_home(request):
    return render(request, 'homepage1.html')


def all_curtains(request):
    product_id = str(request.GET.get('productId'))
    category_id = str(request.GET.get('categoryId'))
    option_id = CURTAINS.ORDER_ID_TYPE[str(request.GET.get('optionId'))]
    context = {'productId': product_id, 'categoryId': category_id, 'optionId': option_id}
    return render(request, 'allCurtains.html', context)


@api_view(['GET'])
def get_option_details(request):
    try:
        response_product_id = str(request.GET.get('productId', 1))
        response_category_id = str(request.GET.get('categoryId', 1))
        response_option_id = CURTAINS.ORDER_ID_TYPE[str(request.GET.get('optionId', 'curtain'))]
        response_page_number = str(request.GET.get('pageNumber', 1))
        print(response_page_number)
        response_data = requests.get(POPTIONS_HOST_URL + 'products-json/' + response_product_id
                                     + '/' + response_category_id + '?optionId=' + response_option_id + '&limit=10&page=' + response_page_number)
        if response_data.status_code != 200:
            raise Exception(response_data.reason)
        else:
            return Response(response_data.json(), 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_curtain_types(request):
    try:
        product_category_id = request.GET.get('productCategoryId', '1')
        response_data = requests.get(POPTIONS_HOST_URL + 'products/' + product_category_id + '/all')
        if response_data.status_code != 200:
            raise Exception(response_data.reason)
        else:
            data = response_data.json()['data']
            new_data = []
            for eachObject in data:
                if eachObject['id'] not in [3, 4]:
                    eachObject['newMainImage'] = CURTAINS.CURTAIN_MAIN_PAIN_IMAGES[str(eachObject['id'])]
                    eachObject['name'] = eachObject['name'].lower().title()
                    new_data.append(eachObject)
            return Response(new_data, 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_hardwares(request):
    try:
        hardware_category_id = str(request.GET.get('hardwareCategoryId', 2))
        curtain_style_id = str(request.GET.get('curtainStyleId', 1))
        page_number = str(request.GET.get('pageNumber', 1))
        response_data = requests.get(POPTIONS_HOST_URL + 'product/related/' + curtain_style_id + '/' + hardware_category_id + '?page=' + page_number + '&limit=6')
        if response_data.status_code != 200:
            raise Exception(response_data.reason)
        else:
            list_of_hardware = response_data.json()['data']
            for each_item in list_of_hardware:
                each_item["displayImage"] = _convert_to_cdn(each_item["displayImage"])
                each_item["zoomImage"] = _convert_to_cdn(each_item["zoomImage"])
                each_item["price"] = int(ceil(each_item["price"] * EMI_PERCENTAGE))
            context = {'data': list_of_hardware, 'totalPages': response_data.json()['totalPages']}
            return Response(context, 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_lining_information(request):
    try:
        data = {}
        product_category_id = request.GET.get('productCategoryId', '1')
        lining_option_id = str(request.GET.get('liningOptionId', 4))
        mount_option_id = str(request.GET.get('mountOptionId', 6))
        lift_option_id = str(request.GET.get('liftOptionId', 7))
        response_data_mount = requests.get(POPTIONS_HOST_URL + 'options/' + product_category_id + '/' + mount_option_id)
        if response_data_mount.status_code != 200:
            raise Exception(response_data_mount.reason)
        response_data_lift = requests.get(POPTIONS_HOST_URL + 'options/' + product_category_id + '/' + lift_option_id)
        if response_data_lift.status_code != 200:
            raise Exception(response_data_lift.reason)
        response_data_lining = requests.get(POPTIONS_HOST_URL + 'options/' + product_category_id + '/' + lining_option_id)
        if response_data_lining.status_code != 200:
            raise Exception(response_data_lining.reason)
        else:
            data['response_data_mount'] = response_data_mount.json()['data']
            data['response_data_lift'] = response_data_lift.json()['data']
            data['response_data_lining'] = response_data_lining.json()['data']

            for eachLining in data['response_data_lining']:
                try:
                    eachLining['description'] = eachLining['description'].split('\\n')
                except:
                    eachLining['description'] = eachLining['description']
            for each_item in data['response_data_lining']:
                each_item["price"] = ceil(each_item['price'] * TAX_RATIO)
        return Response(data, 200)
    except Exception as e:
        return Response(str(e), 500)

@api_view(['GET'])
def get_filter_inputs(request):
    try:
        product_category_id = request.GET.get('productCategoryId', '1')
        option_id = CURTAINS.ORDER_ID_TYPE[str(request.GET.get('optionId'))]
        is_swatch = request.GET.get('isFabric', '0')
        response = requests.get(POPTIONS_HOST_URL + 'filters/' + product_category_id + '/' + option_id + '/' + is_swatch)
        data = response.json()
        sort_input_dict = {
            'sortInput': [
                {'name': 'NEW & POPULAR', 'value': ''},
                {'name': 'PRICE: LOW TO HIGH', 'value': 'materials__price'},
                {'name': 'PRICE: HIGH TO LOW', 'value': '-materials__price'}
            ]
        }
        data.append(sort_input_dict)
        if response.status_code != 200:
            raise Exception(response.reason)
        else:
            return Response(data, 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_filter_input_count(request):
    try:
        option_id = CURTAINS.ORDER_ID_TYPE[str(request.GET.get('optionId', 'curtain'))]
        product_category_id = request.GET.get('productCategoryId', '1')
        query_data = request.GET.get('queryData', None)
        is_swatch = request.GET.get('isFabric', '0')
        query_data_dict = json.loads(query_data)
        for key, value in query_data_dict.items():
            query_data_dict[key] = value.replace(" ", "%20")
        query_data_encoded = urllib.urlencode(query_data_dict)
        url = POPTIONS_HOST_URL + 'filters/' + product_category_id + '/' + option_id + '/' + is_swatch + '?' + query_data_encoded
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(response.reason)
        else:
            return Response(response.json(), 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_filter_data(request):
    try:
        product_category_id = request.GET.get('productCategoryId', '1')
        option_id = CURTAINS.ORDER_ID_TYPE[str(request.GET.get('optionId', 'curtain'))]
        curtain_style_id = str(request.GET.get('curtainStyleId', 1))
        filter_input = str(request.GET.get('filterOptionsInput', ''))
        page_number = str(request.GET.get('pageNumber', 1))
        order_by = str(request.GET.get('sortBy', ''))
        search_by_skuid = str(request.GET.get('searchBySkuId', ''))
        if order_by and filter_input == '':
            url = POPTIONS_HOST_URL + 'products-json/' + curtain_style_id + '/' + product_category_id + '?limit=10&page=' + page_number + '&orderby=' + order_by + '&optionId=' + option_id
        else:
            url = POPTIONS_HOST_URL + 'filter-json/' + curtain_style_id + '/' + option_id + '?limit=10&page=' + page_number + '&filters=' + filter_input
            if order_by:
                url += '&orderby=' + order_by
        if search_by_skuid:
            url = POPTIONS_HOST_URL + 'search-product-by-limit/' + curtain_style_id + '/' + product_category_id + '?limit=10&page=' + page_number + '&search=' + search_by_skuid + '&optionId=' + option_id
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(response.reason)
        else:
            return Response(response.json(), 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_search_data(request):
    try:
        product_category_id = request.GET.get('productCategoryId', '1')
        option_id = CURTAINS.ORDER_ID_TYPE[str(request.GET.get('optionId', 'curtain'))]
        curtain_style_id = str(request.GET.get('curtainStyleId', 1))
        search_by_skuid = str(request.GET.get('searchBySkuId', ''))
        url = ''
        if search_by_skuid:
            url = POPTIONS_HOST_URL + 'search-product-by-limit/' + curtain_style_id + '/' + product_category_id + '?limit=1&page=1' + '&search=' + search_by_skuid + '&optionId=' + option_id
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(response.reason)
        else:
            return Response(response.json(), 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['POST'])
def get_cost(request):
    try:
        data = request.DATA
        product_category = data['optionsData'].get('productCategory', '1')
        url = CURTAINS_HOST_URL + '/api/curtains/get-cost/' + product_category
        response = requests.post(url, json=data['optionsData'], headers=get_headers(request))
        if response.status_code != 200:
            raise Exception(response.reason)
        else:
            return Response(response.json(), 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_category_id(request):
    try:
        product_categories = ['curtains', 'hardware-sets', 'rod', 'finials', 'brackets', 'hold-backs', 'rings']
        product_category_id_map = {}
        for category in product_categories:
            url = POPTIONS_HOST_URL + 'categorydetails/' + category
            response = requests.get(url)
            if response.status_code != 200:
                raise Exception(response.reason)
            product_category_id_map[category] = response.json()
        return Response(product_category_id_map, 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_option_id_by_product_type(request):
    try:
        options = ['fabrics', 'shadeFabric', 'lining', 'shadeLining', 'mount', 'lift']
        option_id_map = {}
        for option in options:
            url = POPTIONS_HOST_URL + 'option/details?name=' + option
            response = requests.get(url)
            if response.status_code != 200:
                raise Exception(response.reason)
            else:
                option_id_map[option] = response.json()[0]['id']
        return Response(option_id_map, 200)
    except Exception as e:
        return Response(str(e), 500)


def get_headers(request):
    if request.user.is_authenticated():
        return {"X-CSRFToken": request._request.COOKIES["csrftoken"], "contentType": "application/json"}
    else:
        return {"contentType": "application/json"}


@never_cache
@api_view(['POST', 'GET'])
def add_sample(request):
    try:
        sample_instance = Samples(request)

        add_response = sample_instance.add_to_samples()
        if add_response.status_code != 200:
            raise Exception(add_response.reason)

        response = sample_instance.get_all_samples()
        if response.status_code != 200:
            raise Exception(response.reason)
        return Response(response.json(), 200)

    except Exception as e:
        return Response(str(e), 500)


@never_cache
@api_view(['POST', 'GET'])
def remove_sample(request):
    try:
        sample_instance = Samples(request)

        remove_response = sample_instance.remove_sample()
        if remove_response.status_code != 200:
            raise Exception(remove_response.reason)

        response = sample_instance.get_all_samples()
        if response.status_code != 200:
            raise Exception(response.reason)
        return Response(response.json(), 200)

    except Exception as e:
        return Response(str(e), 500)


@never_cache
@api_view(['POST', 'GET'])
def delete_samples(request):
    try:
        sample_instance = Samples(request)

        delete_all_response = sample_instance.delete_all_samples()
        if delete_all_response.status_code != 200:
            raise Exception(delete_all_response.reason)

        response = sample_instance.get_all_samples()
        if response.status_code != 200:
            raise Exception(response.reason)
        return Response(response.json(), 200)

    except Exception as e:
        return Response(str(e), 500)


@never_cache
@api_view(['GET'])
def merge_samples(request):
    try:
        sample_instance = Samples(request)

        response = sample_instance.merge_samples()
        if response.status_code != 200:
            raise Exception(response.reason)
        return Response(response.json(), 200)

    except Exception as e:
        return Response(str(e), 500)


@never_cache
@api_view(['GET'])
def get_samples(request):
    try:
        sample_instance = Samples(request)

        response = sample_instance.get_all_samples()
        if response.status_code != 200:
            raise Exception(response.reason)
        return Response(response.json(), 200)

    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_delivered_samples(request):
    try:
        if request.user.is_authenticated():
            url = CURTAINS_HOST_URL + '/api/curtains/get-delivered-samples'
            session = requests.Session()
            response = session.get(url, headers=get_headers(request), cookies=request.COOKIES)
            if response.status_code != 200:
                raise Exception(response.reason)
            return Response(response.json(), 200)
        else:
            return Response({}, 200)
    except Exception as e:
        return Response(str(e), 500)


class Samples:
    def __init__(self, request):
        self._request = request
        self._headers = get_headers(request)

    def add_to_samples(self):
        samples = self._request.DATA['samples']
        url = CURTAINS_HOST_URL + '/api/curtains/add/sample'
        session = requests.Session()
        response = session.post(url, json={'samples': samples}, headers=self._headers, cookies=self._request.COOKIES)
        return response

    def remove_sample(self):
        sample = self._request.DATA['sample']
        url = CURTAINS_HOST_URL + '/api/curtains/remove/sample'
        session = requests.Session()
        response = session.post(url, json={'samples': sample}, headers=self._headers, cookies=self._request.COOKIES)
        return response

    def get_all_samples(self):
        url = CURTAINS_HOST_URL + '/api/curtains/get-items/samples'
        session = requests.Session()
        response = session.get(url, headers=self._headers, cookies=self._request.COOKIES)
        return response

    def delete_all_samples(self):
        url = CURTAINS_HOST_URL + '/api/curtains/deleteAll/samples'
        session = requests.Session()
        response = session.post(url, headers=self._headers, cookies=self._request.COOKIES)
        return response

    def merge_samples(self):
        url = CURTAINS_HOST_URL + '/api/curtains/merge/samples'
        session = requests.Session()
        response = session.get(url, headers=self._headers, cookies=self._request.COOKIES)
        return response


def curtains_upload(request):
    if staffHasAccessTo().list_view_uploader(request.user):
        return render(request,'uploadCurtains.html')
    raise PermissionDenied()


def curtain_admin(request):
    if staffHasAccessTo().list_view_uploader(request.user):
        return render(request, 'curtainsPage.html')
    raise PermissionDenied()


def update_parameter(request):
    if staffHasAccessTo().list_view_uploader(request.user):
        return render(request, 'updateMetaParameter.html', {})
    raise PermissionDenied()


@api_view(['POST'])
def update_meta_parameter(request):
    if staffHasAccessTo().list_view_uploader(request.user):
        update_sheet = request.FILES.get('updateParameter')
        workbook = xlrd.open_workbook(file_contents=update_sheet.read())
        excel_sheet = workbook.sheet_by_index(0)
        data = dict()
        headers = {}

        for i in range(0, excel_sheet.ncols):
            headers.update({i: excel_sheet.cell_value(0, i)})

        for row in range(1, excel_sheet.nrows):
            sku_id = str(int(excel_sheet.cell_value(row, 0)))
            data[sku_id] = dict()
            for col, header in headers.iteritems():
                data[sku_id][header] = excel_sheet.cell_value(row, col)
        url = POPTIONS_HOST_URL + 'optionvalue/update-parameter'
        response = requests.post(url, json={'data': data, 'priceFlag': '**price' in headers.values()})
        if response.status_code != 200:
            return Response(response.text, 500)
        return Response(response, 200)
    raise PermissionDenied()


def get_reverse_filter_map(filter_map):
    reversed_dict = {}
    for k, v in filter_map.iteritems():
        reversed_dict.update({v: k})
    return reversed_dict


@api_view(['GET'])
def download_data(request):
    try:
        url = POPTIONS_HOST_URL + 'download-data'
        data = requests.get(url).json()
        headers = tuple(
            ['skuid', 'price', 'color_filter', 'material_filter', 'pattern_filter', 'brand', 'book', 'gsm', 'material',
             'sr.no', 'shade', 'width', 'rubs', 'horizontal_repeat', 'vertical_repeat', 'quality', 'setCategory'])
        excel_data = []
        excel_data = tablib.Dataset(*excel_data, headers=headers, title='DATA')

        reverse_map = {
            'color_filter_map': get_reverse_filter_map(REPHRASE_FILTERS.COLORS_FILTERS_MAP),
            'material_filter_map': get_reverse_filter_map(REPHRASE_FILTERS.MATERIAL_FILTERS_MAP),
            'pattern_filter_map': get_reverse_filter_map(REPHRASE_FILTERS.PATTERN_FILTERS_MAP)
        }

        for each_row in data:
            row_column = list()
            for each_column in headers:
                field_value = each_row.get(each_column, '')
                if each_column in ['color_filter', 'material_filter', 'pattern_filter']:
                    value = ''
                    for each_filter in field_value:
                        try:
                            filter_value = str(reverse_map[each_column + '_map'][each_filter])
                        except:
                            filter_value = each_filter
                        value += filter_value + ','
                    field_value = value[:-1]
                row_column.append(field_value)
            excel_data.append(tuple(row_column))
        response = HttpResponse(excel_data.xlsx, content_type='application/vnd.ms-excel;charset=utf-8')
        response['Content-Disposition'] = "attachment; filename=curtains_data.xlsx"
        return response
    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_init_info(request):
    response = dict()
    response['optionIds'] = get_option_id_by_product_type(request).data
    response['categoryIds'] = get_category_id(request).data
    response['curtainStyles'] = get_curtain_types(request).data
    response['samples'] = get_samples(request).data
    return Response(response, 200)


@api_view(['GET'])
def get_info(request):
    response = get_init_info(request).data

    response['selectedStyle'] = filter(lambda style: style['name'] == request.GET.get('curtainStyle', 'Eyelet Curtain'), response['curtainStyles'])[0]

    product_category_id = str(response['categoryIds']['curtains']['id'])
    curtain_style_id = str(response['selectedStyle']['id'])
    view = str(request.GET.get('view', '0'))
    option_id = CURTAINS.ORDER_ID_TYPE[str(request.GET.get('optionId', 'curtain'))]
    search_by_skuid = str(request.GET.get('searchBySkuId', ''))
    if view == "0":
        url = POPTIONS_HOST_URL + 'search-product-by-limit/' + curtain_style_id + '/' + product_category_id + '?limit=10&page=1' + '&search=' + search_by_skuid + '&optionId=' + option_id
    else:
        url = POPTIONS_HOST_URL + 'get-fabric-option-id/' + '?optionId=' + option_id + '&search=' + search_by_skuid
    response['selectedProduct'] = requests.get(url).json()['data'][0]

    return Response(response, 200)


@api_view(['GET'])
def get_fabric(request):
    try:
        product_category_id = request.GET.get('productCategoryId', '1')
        option_id = CURTAINS.ORDER_ID_TYPE['curtain']
        filter_input = str(request.GET.get('filterOptionsInput', ''))
        page_number = str(request.GET.get('pageNumber', 1))
        order_by = str(request.GET.get('sortBy', ''))
        search_by_skuid = str(request.GET.get('searchBySkuId', ''))
        url = POPTIONS_HOST_URL + 'get-fabric-data/' + option_id + '?limit=10&page=' + page_number
        if search_by_skuid != '':
            url += '&search=' + search_by_skuid
        elif order_by and filter_input == '':
            url += '&orderby=' + order_by
        elif filter_input != '':
            url = POPTIONS_HOST_URL + 'filters/values/' + option_id + '?limit=12&page=' + page_number + '&filters=' + filter_input + '&isSwatch=1'
            if order_by:
                url += '&orderby=' + order_by

        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(response.reason)
        else:
            return Response(response.json(), 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['GET'])
def get_fabric_option_id(request):
    try:
        search_by_skuid = str(request.GET.get('searchBySkuId'))
        option_id = CURTAINS.ORDER_ID_TYPE[str(request.GET.get('optionId', 'curtain'))]
        url = POPTIONS_HOST_URL + 'get-fabric-option-id/' + '?optionId=' + option_id + '&search=' + search_by_skuid
        response_data = requests.get(url)
        if response_data.status_code != 200:
            raise Exception(response_data.reason)
        else:
            return Response(response_data.json(), 200)
    except Exception as e:
        return Response(str(e), 500)


@api_view(['POST'])
def add_fabric_to_cart(request):
    try:
        no_of_meters = request.DATA.get('noOfMeters')
        skuid = request.DATA.get('skuid')
        url = POPTIONS_HOST_URL + 'get-skuid-price/' + skuid
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(response.reason)
        else:
            result = response.json()
            product_details = json.loads(result['imageData'])
            item = {}
            item['cost'] = result['price']
            item['skuid'] = product_details['skuid']
            item['category'] = 'curtainFabric'
            item['count'] = no_of_meters
            item['image'] = product_details['workingImage']
            item['zoomImage'] = product_details['zoomImage']
            item['name'] = 'Curtain Fabric'
            item['productId'] = '1'
            item['quantity'] = no_of_meters
            item['source'] = request.DATA.get('source')
            _add_item_to_cart(item, request)
            msg = item['name'].upper() + ' added to cart successfully'
            return Response({'success': msg, "result": request.cart.as_dictionary(),"cartCount":request.cart.get_cart_count()}, 200)
    except Exception as e:
        return Response(str(e), 500)


class Search(APIView):

    def get(self, request):
        search = request.GET['searchItem']

        url = CURTAINS_HOST_URL + '/search/products?searchItem=' + search
        response = requests.get(url, stream=True)
        curtains_response = json.loads(response.text)['data']
        curtains_results = self.set_curtains_data(curtains_response)

        return Response({'result': curtains_results})

    def set_curtains_data(self, curtains_response):
        curtains_results = []
        for item in curtains_response:
            data = {}
            data['description'] = item['name']
            data['displayName'] = item['displayName']
            data['imageURLs'] = [item['curtainProductUrl']]
            data['price'] = 'Rs.' + str(int(float(item['price']))) + '/meter'
            data['styleName'] = item['styleName']
            data['skuid'] = item['skuid']
            data['priority'] = item['imagePriority']
            curtains_results.append(data)
        return curtains_results