from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.db import models
from django.db.models import Q
from accounts.models import User
from tasks.models import Project, Milestone, Task, TaskComment, Organization
from tasks.serializers import ProjectSerializer, MilestoneSerializer, TaskSerializer, TaskCommentSerializer, OrganizationSerializer
from tasks.permissions import IsOrganizationMemberOrOwner, IsTaskAssigneeOrMember, IsMilestoneOwnerOrOrganizationMember, IsTaskOwner
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
    permission_classes = [permissions.IsAuthenticated, IsOrganizationMemberOrOwner, IsTaskOwner]

    def perform_create(self, serializer):
        assignee_email = serializer.validated_data.pop('assignee_email', None)
        assignee = None

        if assignee_email:
            try:
                assignee = User.objects.get(email=assignee_email)
            except User.DoesNotExist:
                return Response({'error': 'Assignee with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if assignee is a member of the organization
            organization = serializer.validated_data['milestone'].project.organization
            if not organization.members.filter(id=assignee.id).exists():
                return Response({'error': 'Assignee is not a member of the organization'}, status=status.HTTP_400_BAD_REQUEST)

        # Save the task with the assignee if needed
        task = serializer.save(assignee=assignee)

        # Send an email to the assignee
        send_task_assignment_email(task)

    def get_queryset(self):
        """
        Get tasks where the user is the assignee or a member of the milestone's project's organization.
        """
        return Task.objects.filter(
            Q(assignee=self.request.user) |
            Q(milestone__project__organization__members=self.request.user) |
            Q(milestone__project__organization__owner=self.request.user)
        ).distinct()

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner]

    def perform_update(self, serializer):
        assignee_email = serializer.validated_data.pop('assignee_email', None)
        assignee = None

        if assignee_email:
            assignee = get_object_or_404(User, email=assignee_email)

            # Check if assignee is a member of the organization
            organization = serializer.instance.milestone.project.organization
            if not organization.members.filter(id=assignee.id).exists():
                return Response({'error': 'Assignee is not a member of the organization'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            task = serializer.save(assignee=assignee)
            # Send an email to the assignee
            send_task_assignment_email(task)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset, pk=self.kwargs['pk'])

        # Check object permissions against request user
        self.check_object_permissions(self.request, obj)

        return obj

class TaskCommentListCreateView(generics.ListCreateAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    # permission_classes = [permissions.IsAuthenticated, IsTaskAssigneeOrMember]



# =================== ANALYSTICS VIEWSS ============================

class MilestoneListWithTasksView(generics.ListAPIView):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Get milestones where the user is the owner of the project or a member of the organization.
        """
        return Milestone.objects.filter(
            models.Q(project__owner=self.request.user) |
            models.Q(project__organization__members__id=self.request.user.id)
        ).distinct()
        
        
@api_view(['GET'])
def milestone_task_progress(request, milestone_id):
    try:
        milestone = Milestone.objects.get(id=milestone_id)
        tasks = Task.objects.filter(milestone=milestone)
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(completed=True).count()
        progress = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0

        data = {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'progress': progress,
            'tasks': [
                {
                    'id': task.id,
                    'name': task.name,
                    'description': task.description,
                    'file': task.file.url if task.file else None,
                    'start_date': task.start_date,
                    'due_date': task.due_date,
                    'assignee': task.assignee.username if task.assignee else None,
                    'completed': task.completed
                } for task in tasks
            ]
        }

        return Response(data, status=status.HTTP_200_OK)
    except Milestone.DoesNotExist:
        return Response({'error': 'Milestone not found'}, status=status.HTTP_404_NOT_FOUND)