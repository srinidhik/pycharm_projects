from django.db import models


class AddData(models.Model):
    input1 = models.CharField(max_length=3)
    input2 = models.CharField(max_length=3)
    input3 = models.CharField(max_length=3)
    output = models.CharField(max_length=10)
