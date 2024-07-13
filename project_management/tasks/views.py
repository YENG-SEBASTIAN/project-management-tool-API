from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import models
from accounts.models import User
from tasks.models import Project, Milestone, Task, TaskComment, Organization
from tasks.serializers import ProjectSerializer, MilestoneSerializer, TaskSerializer, TaskCommentSerializer, OrganizationSerializer
from tasks.permissions import IsOrganizationMemberOrOwner, IsTaskAssigneeOrMember, IsMilestoneOwnerOrOrganizationMember
from tasks.utils import send_task_assignment_email

class OrganizationListCreateView(generics.ListCreateAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        """
        Get organizations where the user is the owner or a member.
        """
        return Organization.objects.filter(
            models.Q(owner=self.request.user) |
            models.Q(members__id=self.request.user.id)
        ).distinct()

class OrganizationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMemberOrOwner]

    def perform_update(self, serializer):
        serializer.save()

    def get_queryset(self):
        """
        Get organizations where the user is the owner or a member.
        """
        return self.queryset.filter(
            models.Q(owner=self.request.user) |
            models.Q(members__id=self.request.user.id)
        ).distinct()

class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        """
        Get projects where the user is the owner or a member of the organization.
        """
        return Project.objects.filter(
            models.Q(owner=self.request.user) |
            models.Q(organization__members__id=self.request.user.id)
        ).distinct()

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMemberOrOwner]

    def perform_update(self, serializer):
        serializer.save()

    def get_queryset(self):
        """
        Get projects where the user is the owner or a member of the organization.
        """
        return self.queryset.filter(
            models.Q(owner=self.request.user) |
            models.Q(organization__members__id=self.request.user.id)
        ).distinct()

class MilestoneListCreateView(generics.ListCreateAPIView):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Assign project based on the serializer validated data
        project_id = self.request.data.get('project')
        project = Project.objects.get(id=project_id)
        serializer.save(project=project)

    def get_queryset(self):
        """
        Get milestones where the user is the owner of the project or a member of the organization.
        """
        return Milestone.objects.filter(
            models.Q(project__owner=self.request.user) |
            models.Q(project__organization__members__id=self.request.user.id)
        ).distinct()

    def get_permissions(self):
        """
        Override get_permissions to apply IsMilestoneOwnerOrOrganizationMember for create actions.
        """
        if self.request.method == 'POST':
            return [IsMilestoneOwnerOrOrganizationMember()]
        return super().get_permissions()

class MilestoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated, IsMilestoneOwnerOrOrganizationMember]

    def perform_update(self, serializer):
        serializer.save()

    def get_queryset(self):
        """
        Get milestones where the user is the owner of the project or a member of the organization.
        """
        return self.queryset.filter(
            models.Q(project__owner=self.request.user) |
            models.Q(project__organization__members__id=self.request.user.id)
        ).distinct()

    def get_permissions(self):
        """
        Override get_permissions to apply IsMilestoneOwnerOrOrganizationMember for update and delete actions.
        """
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsMilestoneOwnerOrOrganizationMember()]
        return super().get_permissions()

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        assignee = serializer.validated_data.get('assignee')
        if assignee and not User.objects.filter(email=assignee.email).exists():
            return Response({'error': 'Assignee email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        task = serializer.save()
        if task.assignee:
            send_task_assignment_email(task)

    def get_queryset(self):
        """
        Get tasks where the user is the assignee or a member of the milestone's project's organization.
        """
        return Task.objects.filter(
            models.Q(assignee=self.request.user) |
            models.Q(milestone__project__organization__members__id=self.request.user.id)
        ).distinct()

class TaskDetailView(generics.RetrieveUpdateAPIView):  # Allow only read and update, not delete
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskAssigneeOrMember]

    def perform_update(self, serializer):
        assignee = serializer.validated_data.get('assignee')
        if assignee and not User.objects.filter(email=assignee.email).exists():
            return Response({'error': 'Assignee email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

class TaskCommentListCreateView(generics.ListCreateAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskAssigneeOrMember]
