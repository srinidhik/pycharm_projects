from django.db import models


class Hotel(models.Model):
    HotelName = models.CharField(max_length=15, primary_key=True)
    Amount = models.IntegerField()


class Details(models.Model):
    HotelInfo = models.ForeignKey('Hotel', 'HotelName')
    NoOfPersons = models.IntegerField()
    FromDate = models.DateField()
    ToDate = models.DateField()
    NoOfDays = models.IntegerField()
    TotalAmount = models.IntegerField()


class Login(models.Model):
    username = models.CharField(max_length=15, primary_key=True)
    password = models.CharField(max_length=15)