from django.db import models


class AddData(models.Model):
    input = models.IntegerField()
    output = models.IntegerField()