# permissions.py

from rest_framework.permissions import BasePermission

class IsProjectOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsAssignee(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.assignee == request.user
