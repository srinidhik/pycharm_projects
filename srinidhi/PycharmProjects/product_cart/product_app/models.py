from django.db import models


class AddProduct(models.Model):
    name = models.CharField(max_length=15, primary_key=True)
    rate = models.IntegerField()


class AddCart(models.Model):
    product_name = models.ForeignKey('AddProduct', 'name')
    quantity = models.IntegerField()
    amount = models.IntegerField()