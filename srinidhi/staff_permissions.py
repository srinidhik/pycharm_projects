import copy
from django.core.exceptions import PermissionDenied
from StaffManagement.showroomManager import ShowroomManager
from StaffManagement.constants import STAFF_ROLES, REGISTRATION_ROLES_RESTRICT
from UserManagement.models import Roles
from UserManagement.utils import is_admin

__author__ = 'cfit005'


class staffHasAccessTo(object):
    def assign_cart_data(self, user):
        if user.is_authenticated() and(STAFF_ROLES.ADD_QUOTE in user.roles or STAFF_ROLES.MANAGEMENT in user.roles or is_admin(user.email)):
            return True
        return False

    def add_quote(self, user):
        if user.is_authenticated() and (STAFF_ROLES.ADD_QUOTE in user.roles or STAFF_ROLES.MANAGEMENT in user.roles or is_admin(user.email)):
            return True
        return False


    def bom_uploader(self,user):
        if user.is_authenticated() and (STAFF_ROLES.BOM_UPLOADER in user.roles or is_admin(user.email)):
            return True
        return False


    def add_coupons(self, user):
        if user.is_authenticated() and STAFF_ROLES.DISCOUNT_ADMINISTATOR in user.roles:
            return True
        return False

    def estimators(self, user):
        return self.staff(user)

    def accounts(self, user):
        if user.is_authenticated() and (STAFF_ROLES.ACCOUNTS in user.roles or is_admin(user.email)):
            return True
        return False

    def add_receipt(self, user):
        if user.is_authenticated() and (STAFF_ROLES.ADD_QUOTE in user.roles or STAFF_ROLES.ADD_RECEIPT in user.roles or is_admin(user.email)):
            return True
        return False


    def is_staff(self, user):
        if user.is_authenticated():
            roles = copy.copy(user.roles)
            if STAFF_ROLES.CUSTOMER in roles:
                roles.remove(STAFF_ROLES.CUSTOMER)
            if type(roles) == list and len(roles) > 0:
                return True
        return False


    def staff(self, user):
        if user.is_authenticated() and (STAFF_ROLES.STAFF in user.roles or is_admin(user.email)):
            return True
        return self.is_staff(user)

    def orders_book(self, user):
        if user.is_authenticated() and (STAFF_ROLES.DESIGN_MANAGER in user.roles or STAFF_ROLES.ORDER_ADMINISTATOR in user.roles or is_admin(user.email)):
            return True
        return False

    def list_view_uploader(self, user):
        if user.is_authenticated() and (STAFF_ROLES.LIST_VIEW_UPLOADER in user.roles or is_admin(user.email)):
            return True
        return False

    def fulfillment(self, user):
        if user.is_authenticated() and (STAFF_ROLES.FULFILLMENT in user.roles or is_admin(user.email)):
            return True
        return False

    def management(self, user):
        if user.is_authenticated() and (STAFF_ROLES.MANAGEMENT in user.roles):
            return True
        return False

    def design_manager(self, user):
        if user.is_authenticated() and (STAFF_ROLES.MANAGEMENT in user.roles or STAFF_ROLES.DESIGN_MANAGER in user.roles or is_admin(user.email)):
            return True
        return False

    def design_lead(self, user):
        if user.is_authenticated() and (STAFF_ROLES.DESIGN_LEAD in user.roles or is_admin(user.email)):
            return True
        return False

    def admin(self, user):
        if user.is_authenticated() and is_admin(user.email):
            return True
        return False

    def roles_manager(self, user):
        if user.is_authenticated() and (STAFF_ROLES.ROLES_MANAGER in user.roles or STAFF_ROLES.MANAGEMENT in user.roles or is_admin(user.email)):
            return True
        return False

    def curtains_uploader(self,user):
        if user.is_authenticated() and (STAFF_ROLES.CURTAINS_UPLOADER in user.roles or is_admin(user.email)):
            return True
        return False


    def installation_manager(self, user):
        if user.is_authenticated() and (STAFF_ROLES.INSTALLATION_MANAGER in user.roles ):
            return True
        return False

    def crm_manager(self,user):
        if user.is_authenticated() and (STAFF_ROLES.CRM_MANAGER in user.roles):
            return True
        return False
    
    def get_roles_by_manager(self, user, is_list=None):
        if staffHasAccessTo().roles_manager(user):
               staff_roles = Roles.objects.all().order_by("name")
        elif staffHasAccessTo().installation_manager(user):
                staff_roles = Roles.objects.filter(name__in=REGISTRATION_ROLES_RESTRICT[STAFF_ROLES.INSTALLATION_MANAGER]).order_by("name")
        elif staffHasAccessTo().crm_manager(user):
            staff_roles=Roles.objects.filter(name__in=REGISTRATION_ROLES_RESTRICT[STAFF_ROLES.CRM_MANAGER]).order_by("name")
        elif staffHasAccessTo().design_manager(user):
            staff_roles=Roles.objects.filter(name__in=REGISTRATION_ROLES_RESTRICT[STAFF_ROLES.DESIGN_MANAGER]).order_by("name")
        else:
            raise PermissionDenied("No Permission")
        if is_list:
            return list(staff_roles.values_list("name", flat=True))
        return staff_roles

    def get_places_by_showroom_admin(self, user, is_list=None):
        if staffHasAccessTo.is_showroom_admin(self, user):
            places = ShowroomManager.get_all_showrooms_list()
        else:
            places = []
        if is_list:
            return list(places)
        return places

    def has_permission_to_access_user(self, user, manager):
        accessible_roles = staffHasAccessTo().get_roles_by_manager(manager,True)
        accessible_roles = set(accessible_roles)
        if type(user)==dict:
            user_roles=set(user['roles'])
        else:
            user_roles = set(user.roles)
        if len(user_roles.intersection(accessible_roles)) < 1:
            raise PermissionDenied
        return True

    def executive_manager(self,user):
        if user.is_authenticated() and (STAFF_ROLES.EXECUTIVE_MANAGER in user.roles):
            return True
        return False

    def request_invoice(self, user):
        if user.is_authenticated() and (STAFF_ROLES.REQUEST_INVOICE in user.roles):
            return True
        return False

    def generate_invoice(self, user):
        if user.is_authenticated() and (STAFF_ROLES.GENERATE_INVOICE in user.roles):
            return True
        return False

    def link_godavari_project(self, user):
        if user.is_authenticated() and (STAFF_ROLES.STAFF in user.roles or is_admin(user.email)) and \
                (STAFF_ROLES.CRM_STAFF not in user.roles):
            return True
        return False

    def is_showroom_admin(self, user):
        if user.is_authenticated() and (STAFF_ROLES.SHOWROOM_ADMIN in user.roles):
            return True
        return False

    def is_showroom_staff(self,user):
        if user.is_authenticated() and (STAFF_ROLES.SHOWROOM_INCHARGE in user.roles or STAFF_ROLES.SHOWROOM_STANDARD in user.roles ):
            return True
        return False


    def is_discount_approver(self,user):
        if user.is_authenticated() and (STAFF_ROLES.PRIMARY_DISCOUNT_APPROVER  in user.roles or STAFF_ROLES.SECONDARY_DISCOUNT_APPROVER in user.roles or is_admin(user.email)):
            return True
        return False