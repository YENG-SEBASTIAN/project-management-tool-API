from rest_framework import permissions

class IsOrganizationMemberOrOwner(permissions.BasePermission):
    """
    Permission check for members of the organization or the owner.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the organization or project
        if obj.owner == request.user:
            return True

        # Check if the user is a member of the organization related to the project or milestone
        return obj.project.organization.members.filter(id=request.user.id).exists()

class IsTaskAssigneeOrMember(permissions.BasePermission):
    """
    Permission check for task assignees or organization members.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is the assignee of the task
        if obj.assignee == request.user:
            return True

        # Check if the user is a member of the organization related to the task's milestone
        return obj.milestone.project.organization.members.filter(id=request.user.id).exists()
