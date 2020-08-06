from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from django import http
from datetime import date, timedelta
from staff_data_manage import DataManager
import datetime
from models import Project, Team
from internalkustommadeproject.settings import Redirect_HOST_URL,HOST_URL
import json

__author__ = 'sanjay'


class ShowProjects(APIView):

    def dispatch(self, request, *args, **kwargs):
       try:
           if request.user.is_authenticated() :
               return super(ShowProjects, self).dispatch(request, *args, **kwargs)
           else:
                path = Redirect_HOST_URL+ str(request.path)
                return http.HttpResponseRedirect( HOST_URL + "/login?redirectUrl="+ path)
       except Exception as error:
           return http.HttpResponse(content="Restricted User Access", status=401)


    def get(self, request, format=None):
        if request.user.is_authenticated():
            if "TS_REVIEWER" in request.user.roles:
                email = request.user.email
                data_manager = DataManager(email)
                start_date = date.today() - timedelta(1)
                end_date = datetime.datetime.now()

                is_data_only = json.loads(request.QUERY_PARAMS.get("isData","{}"))
                if is_data_only:
                    start_date = request.QUERY_PARAMS.get("startDate","")
                    end_date = request.QUERY_PARAMS.get("endDate","")
                    employee_projects_details = data_manager.get_review_timesheets_data(start_date, end_date = end_date)
                    return Response({"data": employee_projects_details})
                employee_projects_details = json.dumps(data_manager.get_review_timesheets_data(start_date, end_date = date.today()))
                emp_emails = json.dumps( data_manager.get_employee_emails())
                active_project = data_manager.get_project_details()
                active_teams = data_manager.get_team_details()
                data = {"data": {"employeeProjectsDetails": employee_projects_details, "activeProject": active_project,
                                 "activeTask": active_project, "employeeEmails":emp_emails}}
                return render(request, 'staffTimeManagement/_review_timesheets_page.html', data)
            return render("Restrict access",401)
        else:
            return Response("Please go to customfurnish.com and login",200)


class ShowChart(APIView):

    def dispatch(self, request, *args, **kwargs):
       try:
           if request.user.is_authenticated() :
               return super(ShowChart, self).dispatch(request, *args, **kwargs)
           else:
                path = Redirect_HOST_URL+ str(request.path)
                return http.HttpResponseRedirect( HOST_URL + "/login?redirectUrl="+ path)
       except Exception as error:
           return http.HttpResponse(content="Restricted User Access", status=401)


    def get(self, request, format=None):
        if request.user.is_authenticated():
            if "TS_REVIEWER" in request.user.roles:
                email = request.user.email
                data_manager = DataManager(email)
                employee_projects_details = data_manager.get_all_employee_details()
                active_project = data_manager.get_project_details()
                active_teams = data_manager.get_team_details()
                data = {"data": {"employeeProjectsDetails": employee_projects_details, "activeProject": active_project,
                                 "activeTask": active_project, "activeTeams": active_teams,"showProjects":"true"}}
                return render(request, 'staffTimeManagement/_chart_landing_page.html', data)
            return render("Restrict access",401)
        else:
            return Response("Please go to customfurnish.com and login",200)




