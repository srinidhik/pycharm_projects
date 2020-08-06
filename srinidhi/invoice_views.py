from json import loads
from django.core import serializers
from django.core.exceptions import PermissionDenied
from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.views.generic.base import View
from rest_framework.response import Response
from rest_framework.views import APIView
from InventoryManagement.pagination import Pagination
from UserManagement.staff_permissions import staffHasAccessTo
from checkout.constants import INVOICE_STATUS, INVOICE_SUCCESS_MSG
from checkout.factoryMapping import WAREHOUSE
from checkout.invoice_manager import InvoiceManager
from checkout.models import InvoiceDetails
from checkout.orderAccountManager import OrderAccountManager
from checkout.transaction_utils import get_completed_transactions_by_order_id

__author__ = 'cfit006'


class RequestInvoice(APIView):
    def post(self, request):
        if staffHasAccessTo().request_invoice(request.user):
            try:
                msg = OrderAccountManager(request.DATA.get('orderId', None)).request_invoice(request.DATA.get('itemIdsList', []),
                                                                                       request.DATA.get('deliveryDate', None),
                                                                                       request.DATA.get('wareHouse', None),
                                                                                       request.user)
                return Response({'msg': msg}, 200)
            except Exception as e:
                return Response({'error': str(e)}, 500)
        else:
            return Response({'error': 'Permission Denied'}, 500)


class Invoices(View):
    @never_cache
    def get(self, request):
        if staffHasAccessTo().generate_invoice(request.user) or staffHasAccessTo().request_invoice(request.user):
            order_id = request.GET.get('orderId', None)
            query = {}
            sort = []
            if order_id:
                status = request.GET.get('status', '')
                query["orderId"] = order_id
                sort = ['-deliveryDate']
            else:
                status = request.GET.get('status', INVOICE_STATUS.REQUESTED)
                if status == INVOICE_STATUS.GENERATED:
                    sort = ['-deliveryDate']
                else:
                    sort = ['deliveryDate']
            if status:
                query["status"] = status

            invoices = Pagination(InvoiceDetails, request.GET, query, sort, 10).paginate()
            invoices["data"] = loads(serializers.serialize('json', invoices["data"]))
            return render(request, 'InventoryManagement/requestedInvoices.html', invoices)
        else:
            raise PermissionDenied()


class GenerateInvoice(APIView):
    def post(self, request):
        if staffHasAccessTo().generate_invoice(request.user):
            try:
                serial_number = request.DATA.get('invoiceNo', None)
                invoice = InvoiceManager().get_by_invoice_id(request.DATA.get('invoiceId', None))
                msg = OrderAccountManager(id=invoice.orderId).generate_factory_invoice(invoice, serial_number, request.user)
                return Response({'msg': msg}, 200)
            except Exception as e:
                return Response({'error': str(e)}, 500)
        else:
            return Response({'error': 'Permission Denied'}, 500)


class GetInvoiceDetails(View):
    @never_cache
    def get(self, request):
        if staffHasAccessTo().request_invoice(request.user) or staffHasAccessTo().generate_invoice(request.user):
            order_data = OrderAccountManager(request.GET.get('orderId', None)).data()
            order_data.update({"allWareHouse": WAREHOUSE.ALL})
            return render(request, 'InventoryManagement/requestInvoice.html', order_data)
        else:
            raise PermissionDenied()


class GetOrderPaymentSummary(APIView):
    def get(self, request):
        if staffHasAccessTo().generate_invoice(request.user):
            transactions = get_completed_transactions_by_order_id(request.GET.get('orderId', None))
            order_data = OrderAccountManager(request.GET.get('orderId', None)).data_order_summary()
            ware_house = request.GET.get('wareHouse', None)
            invoice_prefix = InvoiceManager().get_invoice_prefix(ware_house)
            previous_invoice_no = InvoiceManager().get_previous_number(ware_house)
            result = {
                'transactions': loads(serializers.serialize('json', transactions)),
                'orderData': order_data,
                'invoicePrefix': invoice_prefix,
                'previousNo': previous_invoice_no
            }
            return Response(result, 200)
        else:
            return Response({'error': 'Permission Denied'}, 500)


class InvoiceSummary(View):
    @never_cache
    def get(self, request):
        if staffHasAccessTo().generate_invoice(request.user) or staffHasAccessTo().request_invoice(request.user):
            invoice = InvoiceManager().get_by_invoice_id(request.GET.get('invoiceId', None))
            if not invoice.status == INVOICE_STATUS.GENERATED and not staffHasAccessTo().generate_invoice(request.user):
                raise PermissionDenied()
            invoice_content = OrderAccountManager(request.GET.get('orderId', None)).invoice_summary_data(invoice)
            return render(request, 'InventoryManagement/generateInvoice.html', invoice_content)
        else:
            raise PermissionDenied()


class EditInvoiceDeliveryDate(APIView):
    def post(self, request):
        if staffHasAccessTo().request_invoice(request.user):
            try:
                invoice_id = request.DATA.get('invoiceId', None)
                new_delivery_date = request.DATA.get('newDeliveryDate', None)
                InvoiceManager().edit_delivery_date(invoice_id, new_delivery_date, request.user)
                return Response({'msg': INVOICE_SUCCESS_MSG[INVOICE_STATUS.EDIT_DELIVERY_DATE]}, 200)
            except Exception as e:
                return Response({'error': str(e)}, 500)
        else:
            return Response({'error': 'Permission Denied'}, 500)


class CancelInvoice(APIView):
    def post(self, request):
        try:
            invoice = InvoiceManager().get_by_invoice_id(request.DATA.get('invoiceId', None))

            if (invoice.status == INVOICE_STATUS.REQUESTED and staffHasAccessTo().request_invoice(request.user)) or \
                (invoice.status in [INVOICE_STATUS.GENERATED, INVOICE_STATUS.REQUEST_CANCELLATION] and staffHasAccessTo().generate_invoice(request.user)):
                reason = request.DATA.get('cancellationReason', None)
                msg = OrderAccountManager(id=invoice.orderId).cancel_invoice(invoice, reason, request.user)
                return Response({'msg': msg}, 200)
            else:
                return Response({'error': 'Permission Denied'}, 500)
        except Exception as e:
            return Response({'error': str(e)}, 500)


class GetInvoiceStatusBPM(APIView):
    @never_cache
    def get(self, request):
        try:
            order_data = OrderAccountManager(request.GET.get('orderId', None)).data()
            item_id_status_dict = {}
            for itemHandler in order_data['itemsHandler']:
                item_id_status_dict[itemHandler['itemId']] = itemHandler
            return Response({'data': item_id_status_dict}, 200)
        except Exception as e:
            return Response({'error': str(e)}, 500)
