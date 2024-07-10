from rest_framework import permissions

class IsOrganizationMemberOrAssignee(permissions.BasePermission):
    """
    Permission check for members of the organization or assignees of tasks.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the organization
        if obj.owner == request.user:
            return True

        # Check if the user is a member of the organization
        return obj.members_emails.filter(email=request.user.email).exists()

class IsTaskAssignee(permissions.BasePermission):
    """
    Permission check for task assignees.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is the assignee of the task
        return obj.assignee == request.user
