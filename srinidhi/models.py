from django.db import models
from django_mongodb_engine.contrib import MongoDBManager
from djangotoolbox.fields import ListField, DictField
from kustommade.models import CustomModel
from datetime import datetime
from django_mongodb_engine.contrib import MongoDBManager


class Orders(CustomModel):
    # Order Details
    orderId = models.TextField(unique=True)
    orderedDate = models.DateTimeField()
    items = ListField()
    userId = models.TextField(null=True)
    projectType = models.TextField(max_length=20)
    email = models.TextField(null=True)
    expectedDeliveryDate = models.DateTimeField(null=True)

    # Amounts
    currency = models.CharField(max_length=3)
    orderPrice = models.FloatField(default=0)    # sum of itemsPrice + adjustments
    adjustments = DictField()
    itemsTotalPrice = models.FloatField(default=0)
    amountPayable = models.FloatField(default=0)
    amountPaid = models.FloatField(default=0)
    refundAmount = models.IntegerField(default=0)
    transactions = ListField()

    # Status
    orderStatus = models.CharField(max_length=20)
    paymentStatus = models.CharField(max_length=20)
    productionStatus = models.CharField(max_length=200)
    productionStatusLog = DictField()

    # Addresses
    billingName = models.TextField(default='')
    billingAddress = models.TextField(default='')
    billingCity = models.TextField(default='')
    billingState = models.TextField(default='')
    billingPostalCode = models.TextField(default='')
    billingCountry = models.TextField(default='')
    billingPhone = models.TextField(default='')
    deliveryName = models.TextField(default='')
    deliveryAddress = models.TextField(default='')
    deliveryCity = models.TextField(default='')
    deliveryState = models.TextField(default='')
    deliveryPostalCode = models.TextField(default='')
    deliveryCountry = models.TextField(default='')
    deliveryPhone = models.TextField(default='')

    # future scope
    additionalInfo = DictField()

    #admin fields
    refundReason = models.TextField(max_length=1000)
    fulfillmentStatus = models.BooleanField(default=False)
    trackingNumber = models.TextField(default='')
    trackingVia = models.TextField(default='')
    isArchived = models.BooleanField(default=False)
    cancelReason = models.TextField(default='')
    notes = ListField()
    tags = ListField()
    cancelDate = models.DateField(default=datetime.utcnow())
    discountAmount = models.FloatField(default=0.0)
    voucherCode = models.CharField(max_length=30, null=True)
    invoiceId = models.TextField()
    barcodeImage = models.URLField(null=True,default=None)
    leadOwner = models.TextField(null=True,default=None)

    #Bonita projectId
    projectId = models.CharField(max_length=32, null=True)
    quotationId = models.CharField(max_length=32, null=True)
    ip = models.CharField(max_length=32, null=True)

    ref = models.CharField(max_length=32, null=True)

    #store
    orderSource = models.CharField(max_length=32, null=True)
    storeDetails = DictField()

    #gst Number
    gstNumber = models.CharField(max_length=15,null=True)

    logs = ListField()

    class MongoMeta:
        index_together = ["orderedDate"]

class Transaction(CustomModel):
    userId = models.TextField(null=True)
    transactionType = models.TextField()
    transactionStatus = models.TextField()
    gatewayTransactionId = models.TextField(null=True)
    amount = models.FloatField()
    currency = models.TextField()
    responseMessage = models.TextField(null=True)
    completedDate = models.DateTimeField(null=True)
    gateway = models.TextField(null=True)
    orderId = models.TextField(null=True)
    projectId = models.TextField(null=True)
    gatewayResponseId = models.TextField()
    attempts = DictField()
    description = models.TextField(null=True)
    receiptId = models.TextField(null=True)
    paymentMode = models.TextField(null=True)
    transactionPaymentType = models.TextField(null=True)
    extraData = DictField(null=True)
    receiptUrl = models.URLField(null=True)

class GatewayResponse(CustomModel):
    sessionId = models.TextField()
    userId = models.TextField(null=True)
    gateway = models.TextField(null=True)
    gatewayResponse = DictField(null=True)

class Shipping(CustomModel):
    sourceCode = models.IntegerField()
    destinationCode = models.IntegerField()
    itemType = models.TextField()
    cost = models.FloatField()


class Address(CustomModel):
    userId = models.TextField()
    # email = models.EmailField()
    name = models.CharField(max_length=30)
    pinCode = models.CharField(max_length=8)
    address = models.CharField(max_length=250)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=30)
    country = models.CharField(max_length=30)
    phone = models.CharField(max_length=15)
    isDeliveryAddress = models.BooleanField()
    isBillingAddress = models.BooleanField()
    class MongoMeta:
        index_together = ["userId"]

class DiscountInfo(CustomModel):
    code = models.CharField(max_length=30)
    userId = models.CharField(max_length=30)
    lastUsed = models.DateField()
    discountAmount=models.DecimalField(max_digits=10,decimal_places=2)
    totalAmount=models.DecimalField(max_digits=10,decimal_places=2)
    count = models.IntegerField(default=1)
    source = models.CharField(max_length=10,null=True)


class Discount(CustomModel):
    code = models.CharField(max_length=30, unique=True)
    begins = models.DateField()
    expires = models.DateField(null=True)
    discount_type = models.CharField(max_length=30)
    value = models.FloatField(default=0.0)
    max_discount = models.FloatField(default=None,null=True)
    minimum_order_amount=models.FloatField(default=None,null=True)
    status = models.CharField(max_length=30)
    applies_to = DictField(null=True)
    usage_limit = models.IntegerField(null=True, default=-1)
    user_usage_limit=models.IntegerField(null=True,default=-1)
    applied_once = models.BooleanField(default=True)
    times_used = models.IntegerField(default=0)
    cf_id = models.CharField(max_length=30,default=None, null=True)
    quid = models.CharField(max_length=32, null=True)
    applies_to_resource = models.CharField(max_length=30)
    is_product_included = models.BooleanField(default=True)
    updated_at = models.DateField(default=datetime.utcnow())
    used_by = DictField(null=True)
    usable_by = models.CharField(max_length=2048)
    generated_by = models.EmailField()
    approval_required = models.BooleanField(default=False)

    class MongoMeta:
        index_together = ["begins"]


class Invoice(CustomModel):
    invoiceId = models.TextField()
    orderId = models.TextField()


class InvoiceDetails(CustomModel):
    orderId = models.CharField(max_length=30, blank=False)
    invoiceNumber = models.CharField(max_length=30, null=True)
    wareHouse = models.CharField(max_length=30, blank=True)
    invoiceUrl = models.URLField(default=None, null=True)
    status = models.CharField(max_length=30, blank=False)
    userInfo = DictField()
    items = ListField()
    amountDetails = DictField()
    deliveryDate = models.DateTimeField(default=None, null=True)
    additionalInfo = DictField()
    invoiceAmount = models.FloatField(default=0)
    recordedInvoiceAmount = models.IntegerField(default=0)
    activityLog = ListField()
    requestedDate = models.DateTimeField(default=None, null=True)
    requestedBy = models.CharField(max_length=30)
    generatedDate = models.DateTimeField(default=None, null=True)
    generatedBy = models.CharField(max_length=30)