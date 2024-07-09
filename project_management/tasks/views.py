
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from tasks.models import Project, Milestone, Task, TaskComment, Organization
from tasks.serializers import ProjectSerializer, MilestoneSerializer, TaskSerializer, TaskCommentSerializer, OrganizationSerializer
from tasks.permissions import IsOrganizationOwner, IsOrganizationMemberOrAssignee, IsTaskAssignee
from tasks.utils import send_task_assignment_email, send_organization_member_email

class OrganizationListCreateView(generics.ListCreateAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class OrganizationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated, IsOrganizationOwner]

    def perform_update(self, serializer):
        serializer.save()


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMemberOrAssignee]

    def perform_update(self, serializer):
        serializer.save()

class MilestoneListCreateView(generics.ListCreateAPIView):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [IsAuthenticated]

class MilestoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMemberOrAssignee | IsTaskAssignee]


class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        task = serializer.save()
        if task.assignee:
            send_task_assignment_email(task)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMemberOrAssignee | IsTaskAssignee]



class TaskCommentListCreateView(generics.ListCreateAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [IsAuthenticated]

class TaskCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMemberOrAssignee | IsTaskAssignee]
