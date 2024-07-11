from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import models
from django.contrib.auth.models import User
from tasks.models import Project, Milestone, Task, TaskComment, Organization
from tasks.serializers import ProjectSerializer, MilestoneSerializer, TaskSerializer, TaskCommentSerializer, OrganizationSerializer
from tasks.permissions import IsOrganizationMemberOrOwner, IsTaskAssigneeOrMember
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
            models.Q(members_emails__email=self.request.user.email)
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
        return Organization.objects.filter(
            models.Q(owner=self.request.user) |
            models.Q(members_emails__email=self.request.user.email)
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
            models.Q(organization__members_emails__email=self.request.user.email)
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
        return Project.objects.filter(
            models.Q(owner=self.request.user) |
            models.Q(organization__members_emails__email=self.request.user.email)
        ).distinct()

class MilestoneListCreateView(generics.ListCreateAPIView):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

class MilestoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMemberOrOwner]

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
            models.Q(milestone__project__organization__members_emails__email=self.request.user.email)
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
