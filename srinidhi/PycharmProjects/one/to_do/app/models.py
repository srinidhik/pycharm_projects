from django.db import models


class AddData(models.Model):
    date = models.DateField()
    task = models.CharField(max_length=20)
    status = models.CharField(max_length=15, default='Incomplete')


