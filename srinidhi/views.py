import json
from django.http import HttpResponse
from django.shortcuts import render
from DocumentRepository.constants import DOCUMENT_ROLES
from DocumentRepository.models import UploadDetails
from Utils.S3Management import FileManagement
from bson import ObjectId

__author__ = 'cfit008'


def document_repository(request):
    if request.user.is_authenticated():
        result = {}
        details = UploadDetails.objects.all().order_by('-createdAt')
        data = list()
        for eachObject in details:
            data.append({'category': eachObject.category, 'name': eachObject.name,'description': eachObject.description,'document': eachObject.document, 'uploadedDate':str(eachObject.createdAt)})
        result['data'] = json.dumps(data)
        return render(request, 'uploadDetails.html', result)
    return render(request, 'uploadDetails.html', {})



def save_document(request):
    if request.user.is_authenticated():
        if DOCUMENT_ROLES.ADD_DOCUMENT in request.user.roles:
            document_name = request.POST['name']
            category_name = request.POST['category']
            description = request.POST['description']

            if request.FILES.get('file'):
                file_obj = request.FILES['file']
                file_manager = FileManagement()
                file_uploaded = file_manager.upload(file_obj, ObjectId())

            UploadDetails(name=document_name, category=category_name, description=description, document=file_uploaded).save()
            return HttpResponse("Details Added")
        else:
            return render(request, "login.html", {})
    else:
        return render(request, "login.html", {})
