from django.db import models


class AddData(models.Model):
    input = models.CharField(max_length=50)
    output = models.CharField(max_length=50)