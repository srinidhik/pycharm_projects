from checkout.HSN_code_manager import HSNCodeManager
from checkout.ItemAccountHandler import ItemAccountHandler
from checkout.constants import INVOICE_STATUS, INVOICE_SUCCESS_MSG
from checkout.factoryMapping import WAREHOUSE_ADDRESS
from checkout.invoice_manager import InvoiceManager
from checkout.models import Orders
from checkout.discountAccountContainer import VoucherContainer
from django.template import Context
from django.template.loader import get_template
import pdfkit
from bson.objectid import ObjectId
from Utils.S3Management import FileManagement
from checkout.transaction_utils import get_order_amount_paid, get_project_paid_amount

__author__ = 'cfit006'


class OrderAccountManager():
    def __init__(self, id=None, order=None):
        self.order = None
        if order:
            self.order = order
        else:
            self.order = Orders.objects.get(id=id)

        self.discount = None
        self.discount_type = None
        self.items_handlers = []
        self.order_price = 0
        self.advance_price = 0
        self.amount_paid = 0
        self.on_hold_amount = None
        self.unconsumed_amount = None
        self.invoiced_amount = None
        self.dc = None

        self.__init_item_handler()
        self._init_order_price()
        self._init_disc_amount()
        self.__distribute_discount()
        self._init_advance_price()
        self._init_amount_paid()
        self.get_amount_paid()
        self.cal_on_hold_amount()
        self.cal_unconsumed_amount()

    def get_order_id(self):
        return self.order.id

    def __init_item_handler(self):
        for item in self.order.items:
            self._add_item_handler(item)

    def get_items_handlers(self):
        return self.items_handlers

    def _add_item_handler(self, item):
        if not item.get('source', '') == 'godavari':
            hsn_code = HSNCodeManager.get_by_item(item)
            item_handler = ItemAccountHandler(item, hsn_code, self.get_delivery_state(), False)
        else:
            item_handler = ItemAccountHandler(item, 'default', self.get_delivery_state(), True)
        self.items_handlers.append(item_handler)

    def __distribute_discount(self):
        if self.get_voucher_code():
            if self.get_discount_amount():
                self.dc = VoucherContainer(self.get_items_handlers(), self.get_discount_amount(), self.get_voucher_code())

    def get_voucher_code(self):
        return self.order.adjustments['discount'].get('couponCode', None)

    def _init_disc_amount(self):
        self.discount = self.order.adjustments['discount'].get('amount', 0)

    def cal_on_hold_amount(self):
        used_amount = 0

        for item_handler in self.get_items_handlers():
            # TO-DO Need be fix floating round of issue
            # used_amount += int(item_handler.get_used_amount())
            used_amount += item_handler.get_used_amount()

        self.on_hold_amount = self.get_amount_paid() - used_amount

    def cal_consumed_amount(self):
        consumed_amount = 0

        for item_handler in self.get_items_handlers():
            consumed_amount += item_handler.get_consumed_amount()

        return consumed_amount

    def cal_unconsumed_amount(self):
        self.unconsumed_amount = self.get_amount_paid() - self.cal_consumed_amount()

    def _init_order_price(self):
        if self.order.adjustments['taxIncluded']:
            tax = 0
        else:
            tax = self.order.adjustments['tax']
        self.order_price = self.order.itemsTotalPrice + tax

    def _init_advance_price(self):
        self.advance_price = sum(item_handler.final_advance for item_handler in self.get_items_handlers())

    def _init_amount_paid(self):
        if self.get_projectId():
            self.amount_paid = get_project_paid_amount(self.get_projectId())
        else:
            self.amount_paid = get_order_amount_paid(self.get_order_id())

    def get_delivery_state(self):
        return self.order.deliveryState

    def get_KMID(self):
        return self.order.orderId

    def get_projectId(self):
        if hasattr(self.order, 'projectId'):
            return self.order.projectId
        else:
            return None

    def get_amount_paid(self):
        # return self.order.amountPaid
        return self.amount_paid

    def get_advance_price(self):
        return self.advance_price

    def get_order_price(self):
        return self.order_price

    def get_on_hold_amount(self):
        return self.on_hold_amount

    def get_unconsumed_amount(self):
        return self.unconsumed_amount

    def get_discount_amount(self):
        return self.discount

    def get_shipping_price(self):
        return self.order.adjustments.get('shipping', 0)

    def get_order_total_amount(self):
        return self.get_order_price() + self.get_shipping_price() - self.get_discount_amount()

    def _set_invoiced_amount(self):
        self.invoiced_amount = InvoiceManager().get_invoiced_amount_by_order_id(self.get_order_id())

    def get_invoiced_amount(self):
        # sum of price of all items in order whose invoice is generated
        if not self.invoiced_amount:
            self._set_invoiced_amount()
        return self.invoiced_amount

    def get_invoiceable_amount(self):
        # amount which is available in order for invoice generation
        return self.get_amount_paid() - self.get_invoiced_amount()
        # invoiceable_amount = 0
        #
        # balance = self.get_on_hold_amount()
        # for item_handler in self.get_items_handlers():
        #     if item_handler.get_invoice_status() not in [INVOICE_STATUS.GENERATED]:
        #         item_balance_amount = item_handler.get_remaining_payment()
        #         if item_balance_amount == 0:
        #             invoiceable_amount += item_handler.get_net_price()
        #         else:
        #             if item_balance_amount <= balance:
        #                 invoiceable_amount += item_handler.get_net_price()
        #                 balance -= item_balance_amount
        #
        # return invoiceable_amount

    def get_item_handlers_by_ids(self, item_ids):
        selected_item_handlers = []
        for item_handler in self.get_items_handlers():
            if item_handler.get_item_id() in item_ids:
                selected_item_handlers.append(item_handler)

        return selected_item_handlers

    def get_item_handler_by_id(self, id):
        for item_handler in self.get_items_handlers():
            if item_handler.get_item_id() == id:
                return item_handler

    def check_items_payment1(self, item_ids_list):
        # requested items payment is checked before invoice request
        total_amount_paid_items = []

        balance = self.get_on_hold_amount()

        item_handlers = self.get_item_handlers_by_ids(item_ids_list)

        if balance >= 0:
            for item_handler in item_handlers:
                item_balance_amount = item_handler.get_remaining_payment()
                if item_balance_amount == 0:
                    total_amount_paid_items.append(item_handler.get_item_id())
                else:
                    if item_balance_amount <= balance:
                        total_amount_paid_items.append(item_handler.get_item_id())
                        balance -= item_balance_amount

        if not len(item_ids_list) == len(total_amount_paid_items):
            raise Exception('Payment Pending')

    def check_items_payment(self, item_handlers):
        # requested items payment is checked before invoice request
        count = 0

        balance = self.get_unconsumed_amount()

        if balance >= 0:
            for item_handler in item_handlers:
                item_amount = item_handler.get_net_price()
                if item_handler.get_amount_paid() == item_amount and int(item_amount) <= int(balance):
                    count += 1
                    balance -= item_amount

        if not len(item_handlers) == count:
            raise Exception('Payment Pending')

    def _save_items_amount_paid_to_order(self, selected_items_handlers=None):
        if not selected_items_handlers:
            selected_items_handlers = self.get_items_handlers()
        order = Orders.objects.get(id=self.get_order_id())
        selected_items = dict([item_handler.get_item_id(), item_handler] for item_handler in selected_items_handlers)
        for item in order.items:
            item_handler = selected_items.get(item["itemId"])
            if item_handler:
                if item.get("invoiceStatus", "") in [INVOICE_STATUS.REJECT, INVOICE_STATUS.CANCELLED]:
                    item["invoiceAmountPaid"] = 0
                else:
                    item["invoiceAmountPaid"] = item_handler.get_amount_paid()
        order.save()

    def _save_items_status_to_order(self, invoice_item_handlers, invoice):
        if not invoice_item_handlers:
            invoice_item_handlers = self.get_items_handlers()
        order = Orders.objects.get(id=self.get_order_id())
        selected_items = dict([item_handler.get_item_id(), item_handler] for item_handler in invoice_item_handlers)
        for item in order.items:
            item_handler = selected_items.get(item["itemId"])
            if item_handler:
                item["invoiceStatus"] = InvoiceManager().get_status(invoice)
        order.save()

    def get_amount_details(self, item_handlers):
        return {
            'basePrice': sum(item_handler.get_total_base_price() for item_handler in item_handlers),
            'discountOnBasePrice': sum(item_handler.get_discount_base_price() for item_handler in item_handlers),
            'shippingBasePrice': sum(item_handler.get_shipping_base_price() for item_handler in item_handlers),
            'taxablePrice': sum(item_handler.get_taxable_price() for item_handler in item_handlers),
            'cgstTaxAmount': sum(item_handler.CGST_price for item_handler in item_handlers),
            'sgstTaxAmount': sum(item_handler.SGST_price for item_handler in item_handlers),
            'igstTaxAmount': sum(item_handler.IGST_price for item_handler in item_handlers)
        }

    def get_user_info(self):
        return {
            'userId': self.order.userId,
            'name': self.order.deliveryName,
            'phoneNumber': self.order.deliveryPhone,
            'address': {
                'name': self.order.deliveryName,
                'phoneNumber': self.order.deliveryPhone,
                'address': self.order.deliveryAddress,
                'city': self.order.deliveryCity,
                'state': self.order.deliveryState,
                'country': self.order.deliveryCountry,
                'pinCode': self.order.deliveryPostalCode,
            },
            'emailId': self.order.email,
        }

    def get_additional_info(self, item_handlers):
        return {
            'totalQuantity': sum(item_handler.quantity for item_handler in item_handlers),
            'KMID': self.get_KMID()
        }

    def render_to_pdf(self, template, context_dict):
        template = get_template(template)
        context = Context(context_dict)
        html = template.render(context)
        options = {}
        pdf = pdfkit.from_string(html, "", options=options)
        return pdf

    def pdf_upload_to_s3(self, pdf, url_prefix):
        s3_name = url_prefix + str(ObjectId())
        file_manager = FileManagement()
        invoice_url = file_manager.upload_string(pdf, s3_name, 'application/pdf')
        return invoice_url

    def get_items_data(self, items_handlers=None):
        items = []
        if not items_handlers:
            items_handlers = self.get_items_handlers()
        for item_handler in items_handlers:
            items.append(item_handler.data())
        return items

    def get_items_invoice_data(self, items_handlers):
        items = []
        for item_handler in items_handlers:
            items.extend(item_handler.invoice_data())

        return items

    def check_for_unconsumed_amount(self, item_handlers):
        items_price_sum = sum(item_handler.get_net_price() for item_handler in item_handlers)
        if int(items_price_sum) > int(self.get_unconsumed_amount()):   # int is used to avoid condition failure due to float value
            raise Exception('Amount Insufficient')

    def distribute_paid_amount(self, item_handlers):
        self.check_for_unconsumed_amount(item_handlers)

        undistributed_amount = self.get_unconsumed_amount()

        for item_handler in item_handlers:
            pending_amount = item_handler.get_pending_amount()
            if int(pending_amount) > int(undistributed_amount):
                raise Exception('Amount Insufficient')
            item_handler.add_amount_paid(pending_amount)
            undistributed_amount -= item_handler.get_amount_paid()

    # def compare_warehouse(self, ware_house_list, ware_house):
    #     if not len(ware_house_list) == 1:
    #         raise Exception("Selected items are from different Warehouse.")
    #     if not ware_house_list[0] == ware_house:
    #         raise Exception("Warehouse mismatch.")

    def check_hsn_code(self, selected_item_handlers):
        for item_handler in selected_item_handlers:
            item_handler.check_hsn_code()

    def check_ware_house(self, selected_item_handlers, ware_house):
        for item_handler in selected_item_handlers:
            if not item_handler.get_warehouse() == ware_house:
                raise Exception("Warehouse mismatch.")

    def request_invoice(self, item_ids_list, delivery_date, ware_house, user):
        selected_item_handlers = self.get_item_handlers_by_ids(item_ids_list)
        self.distribute_paid_amount(selected_item_handlers)
        self.check_items_payment(selected_item_handlers)
        self.check_hsn_code(selected_item_handlers)
        self.check_ware_house(selected_item_handlers, ware_house)

        invoice_amount = sum(item_handler.get_net_price() for item_handler in selected_item_handlers)

        data = dict(orderId=self.get_order_id(),
                    deliveryDate=delivery_date,
                    wareHouse=ware_house,
                    status=INVOICE_STATUS.REQUESTED,
                    items=self.get_items_data(selected_item_handlers),
                    invoiceAmount=invoice_amount,
                    recordedInvoiceAmount=round(invoice_amount),
                    additionalInfo=self.get_additional_info(selected_item_handlers),
                    amountDetails=self.get_amount_details(selected_item_handlers),
                    userInfo=self.get_user_info())

        new_invoice = InvoiceManager().create_invoice(data, user)
        self._save_items_status_to_order(selected_item_handlers, new_invoice)
        self._save_items_amount_paid_to_order(selected_item_handlers)

        return INVOICE_SUCCESS_MSG[new_invoice.status]

    def check_amount_for_generation(self, invoice):
        if int(invoice.invoiceAmount) > int(self.get_invoiceable_amount()):
            raise Exception('Payment Pending')

    def get_invoice_content(self, invoice):
        ids_list = [item['itemId'] for item in invoice.items]
        item_handlers = self.get_item_handlers_by_ids(ids_list)
        gst_number = Orders.objects.get(id=invoice.orderId).gstNumber
        content = {
            'userInfo': invoice.userInfo,
            'orderId': invoice.orderId,
            'KMID': invoice.additionalInfo['KMID'],
            'totalQuantity': invoice.additionalInfo['totalQuantity'],
            'items': self.get_items_invoice_data(item_handlers),
            'amountDetails': invoice.amountDetails,
            'invoiceAmount': invoice.invoiceAmount,
            'recordedInvoiceAmount': invoice.recordedInvoiceAmount,
            'deliveryDate': invoice.deliveryDate,
            'unitAddress': WAREHOUSE_ADDRESS[invoice.wareHouse],
            'gstNumber':gst_number
        }

        if invoice.status == INVOICE_STATUS.REQUESTED:
            content['invoicePrefix'] = InvoiceManager().get_invoice_prefix(invoice.wareHouse)
            content['previousNo'] = InvoiceManager().get_previous_number(invoice.wareHouse)
        else:
            content['invoiceNumber'] = invoice.invoiceNumber
            content['invoiceUrl'] = invoice.invoiceUrl

        return content

    def create_pdf(self, invoice, invoice_no):
        invoice_content = self.get_invoice_content(invoice)
        invoice_content['invoiceNumber'] = invoice_no

        invoice_file = self.render_to_pdf('InventoryManagement/generateInvoiceTemplate.html', invoice_content)
        url_prefix = "/cf-invoice/" + invoice_no + "/"

        invoice_url = self.pdf_upload_to_s3(invoice_file, url_prefix)
        return invoice_url

    def generate_factory_invoice(self, invoice, serial_number, user):
        self.check_amount_for_generation(invoice)
        item_ids_list = [invoice_item['itemId'] for invoice_item in invoice.items]
        selected_item_handlers = self.get_item_handlers_by_ids(item_ids_list)
        self.check_hsn_code(selected_item_handlers)
        self.check_ware_house(selected_item_handlers, invoice.wareHouse)

        invoice_prefix = InvoiceManager().get_invoice_prefix(invoice.wareHouse)
        invoice_no = invoice_prefix + str(serial_number).zfill(4)
        invoice_url = self.create_pdf(invoice, invoice_no)
        invoice = InvoiceManager().mark_as_generated(invoice, invoice_no, invoice_url, user)

        self._save_items_status_to_order(selected_item_handlers, invoice)

        return INVOICE_SUCCESS_MSG[invoice.status]

    def cancel_invoice(self, invoice, reason, user):
        item_ids_list = [invoice_item['itemId'] for invoice_item in invoice.items]
        selected_item_handlers = self.get_item_handlers_by_ids(item_ids_list)

        invoice = InvoiceManager().cancel_invoice(invoice, reason, user)

        self._save_items_status_to_order(selected_item_handlers, invoice)
        if invoice.status in [INVOICE_STATUS.REJECT, INVOICE_STATUS.CANCELLED]:
            self._save_items_amount_paid_to_order(selected_item_handlers)

        return INVOICE_SUCCESS_MSG[invoice.status]

    def data(self):
        return {
            "order": self.order,
            "advancePrice": self.get_advance_price(),
            "onHoldAmount": self.get_on_hold_amount(),
            "unconsumedAmount": self.get_unconsumed_amount(),
            "itemsHandler": self.get_items_data(),
            "amountPaid": self.get_amount_paid()
        }

    def data_order_summary(self):
        return {
            "orderPrice": self.get_order_price(),
            "discountAmount": self.get_discount_amount(),
            "shippingPrice": self.get_shipping_price(),
            "amountPaid": self.get_amount_paid(),
            "invoicedAmount": self.get_invoiced_amount(),
            "invoiceableAmount": self.get_invoiceable_amount(),
            "orderTotalAmount": self.get_order_total_amount()
        }

    def invoice_summary_data(self, invoice):
        data = self.get_invoice_content(invoice)
        data["orderTotalAmount"] = self.get_order_total_amount()
        data["amountPaid"] = self.get_amount_paid()
        data["invoicedAmount"] = self.get_invoiced_amount()
        data["invoiceableAmount"] = self.get_invoiceable_amount()
        return data
