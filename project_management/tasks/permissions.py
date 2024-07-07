# permissions.py

from rest_framework.permissions import BasePermission

class IsOrganizationOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsOrganizationMemberOrAssignee(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return user == obj.owner or user in obj.members.all()

class IsTaskAssignee(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner or obj.assignee == request.user
