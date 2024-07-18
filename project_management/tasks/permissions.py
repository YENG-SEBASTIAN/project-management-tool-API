from rest_framework import permissions
from tasks.models import Project

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


class IsMilestoneOwnerOrOrganizationMember(permissions.BasePermission):
    """
    Permission check for milestone operations.
    Allows viewing details of milestones in projects the user owns or is a member of the organization.
    Allows creating milestones only in projects the user owns.
    Does not allow updating or deleting milestones in projects the user did not create.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the project
        if obj.project.owner == request.user:
            return True

        # Check if the user is a member of the organization related to the project
        if obj.project.organization.members.filter(id=request.user.id).exists():
            # Allow only GET (view) permissions for organization members
            return request.method in permissions.SAFE_METHODS  # GET, HEAD, OPTIONS

        return False

    def has_permission(self, request, view):
        # Allow creation of milestones only in projects the user owns
        if request.method == 'POST':
            project_id = request.data.get('project')
            if project_id:
                project = Project.objects.get(id=project_id)
                return project.owner == request.user
        return True


class IsTaskOwner(permissions.BasePermission):
    """
    Permission check to ensure only the owner can add, update, or delete tasks.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the project
        if obj.milestone.project.owner == request.user:
            return True
        
        # Check if the user is a member of the organization related to the project
        if obj.milestone.project.organization.members.filter(id=request.user.id).exists():
            # Allow only GET (view) permissions for organization members
            return request.method in permissions.SAFE_METHODS  # GET, HEAD, OPTIONS

        return False

    def has_permission(self, request, view):
        # Allow creation of tasks only if the user is the owner of the project
        if request.method == 'POST':
            project_id = request.data.get('project')
            if project_id:
                project = Project.objects.get(id=project_id)
                return project.owner == request.user
        return True