# serializers.py

from rest_framework import serializers
from accounts.models import User
from tasks.models import Project, Milestone, Task, TaskComment, TaskLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'created_at', 'updated_at']

class MilestoneSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = Milestone
        fields = ['id', 'name', 'due_date', 'project', 'created_at', 'updated_at']

class TaskSerializer(serializers.ModelSerializer):
    milestone = MilestoneSerializer(read_only=True)
    assignee = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'milestone', 'assignee', 'completed', 'created_at', 'updated_at']

class TaskCommentSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = TaskComment
        fields = ['id', 'task', 'user', 'comment', 'created_at']

class TaskLogSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = TaskLog
        fields = ['id', 'task', 'user', 'action', 'timestamp']
