from datetime import datetime
from InventoryManagement.utils import convert_IST_to_UTC
from checkout.constants import INVOICE_STATUS
from checkout.factoryMapping import WAREHOUSE_INVOICE_PREFIX
from checkout.models import InvoiceDetails

__author__ = 'cfit006'


class InvoiceManager():
    def create_invoice(self, data, user):
        for key, value in data.iteritems():
            if not value:
                raise Exception("Value of " + key + " cannot be null")

        delivery_date_utc = convert_IST_to_UTC(datetime.strptime(data['deliveryDate'], "%Y-%m-%d"))
        self.check_delivery_date(delivery_date_utc)

        activity_log = [self.get_activity_log(user, INVOICE_STATUS.REQUESTED)]

        return InvoiceDetails.objects.create(orderId=data['orderId'],
                                      deliveryDate=delivery_date_utc,
                                      wareHouse=data['wareHouse'],
                                      status=INVOICE_STATUS.REQUESTED,
                                      items=data['items'],
                                      invoiceAmount=data['invoiceAmount'],
                                      recordedInvoiceAmount=data['recordedInvoiceAmount'],
                                      additionalInfo=data['additionalInfo'],
                                      amountDetails=data['amountDetails'],
                                      userInfo=data['userInfo'],
                                      activityLog=activity_log,
                                      requestedDate=datetime.utcnow(),
                                      requestedBy=user.id)

    def check_delivery_date(self, delivery_date):
        today = datetime.utcnow()
        if today > delivery_date:
            raise Exception("Delivery date is not valid")

    def check_for_invoice_number_existance(self, invoice_no):
        if InvoiceDetails.objects.filter(invoiceNumber=invoice_no).count():
            raise Exception("Invoice Number is already used")

    def mark_as_generated(self, invoice, invoice_no, invoice_url, user):
        self.check_for_invoice_number_existance(invoice_no)
        self.check_delivery_date(invoice.deliveryDate)
        activity_log = self.get_activity_log(user, INVOICE_STATUS.GENERATED)
        invoice.status = INVOICE_STATUS.GENERATED
        invoice.invoiceNumber = invoice_no
        invoice.invoiceUrl = invoice_url
        invoice.activityLog.append(activity_log)
        invoice.generatedDate = datetime.utcnow()
        invoice.generatedBy = user.id
        invoice.save()
        return invoice

    def get_by_invoice_id(self, invoice_id):
        return InvoiceDetails.objects.get(id=invoice_id)

    def get_status(self, invoice):
        return invoice.status

    def edit_delivery_date(self, invoice_id, new_delivery_date, user):
        invoice = self.get_by_invoice_id(invoice_id)
        if invoice.status == INVOICE_STATUS.REQUESTED:
            new_delivery_date_utc = convert_IST_to_UTC(datetime.strptime(new_delivery_date, "%Y-%m-%d"))
            self.check_delivery_date(new_delivery_date_utc)
            activity_log = self.get_activity_log(user, INVOICE_STATUS.EDIT_DELIVERY_DATE)
            invoice.deliveryDate = new_delivery_date_utc
            invoice.activityLog.append(activity_log)
            invoice.save()
        else:
            raise Exception("Cannot Edit Delivery date")

    def get_generated_invoices_by_order_id(self, order_id):
        return InvoiceDetails.objects.filter(orderId=order_id, status=INVOICE_STATUS.GENERATED)

    def get_invoiced_amount_by_order_id(self, order_id):
        invoices = self.get_generated_invoices_by_order_id(order_id)
        return sum(invoice.invoiceAmount for invoice in invoices)

    def get_invoice_prefix(self, ware_house):
        ware_house_invoice_prefix = WAREHOUSE_INVOICE_PREFIX[ware_house]
        year = str(datetime.today().year + 1 if datetime.today().month > 3 else datetime.today().year)[-2:]
        return 'CF/' + ware_house_invoice_prefix + '/FY' + year + '/'

    def get_previous_number(self, ware_house):
        try:
            previous_invoice = InvoiceDetails.objects.filter(wareHouse=ware_house, status__in=[INVOICE_STATUS.GENERATED, INVOICE_STATUS.CANCELLED]).order_by('-invoiceNumber')[0]
            return previous_invoice.invoiceNumber.split('/')[-1]
        except:
            return 0

    def get_activity_log(self, user, activity, comments=''):
        return {
            'userId': user.id,
            'email': user.email,
            'activity': activity,
            'date': datetime.utcnow(),
            'comments': comments
        }

    def cancel_invoice(self, invoice, reason, user):
        invoice_status = ""

        if invoice.status == INVOICE_STATUS.REQUESTED:
            invoice_status = INVOICE_STATUS.REJECT
        elif invoice.status == INVOICE_STATUS.GENERATED:
            invoice_status = INVOICE_STATUS.REQUEST_CANCELLATION
        elif invoice.status == INVOICE_STATUS.REQUEST_CANCELLATION:
            invoice_status = INVOICE_STATUS.CANCELLED

        if invoice_status:
            invoice.status = invoice_status
            activity_log = self.get_activity_log(user, invoice_status, reason)
            invoice.activityLog.append(activity_log)
            invoice.save()
            return invoice
        else:
            raise Exception("Invoice status cannot be null")
