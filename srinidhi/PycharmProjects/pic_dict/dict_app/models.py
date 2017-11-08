from time import time
from django.core.files.storage import FileSystemStorage
from django.db import models


def file_name(instance,filename):
   return "media/%s_%s"%(str(time())).replace('.','_',filename)


filelocation = FileSystemStorage(location='/media')


class AddData(models.Model):
    letter = models.CharField(max_length=1)
    word = models.CharField(max_length=15)
    picture = models.FileField(storage=filelocation, upload_to=file_name)


