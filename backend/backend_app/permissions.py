# permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff

class IsCustomerReadOnly(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            not request.user.is_staff and 
            request.method in SAFE_METHODS
        )
