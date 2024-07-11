from rest_framework import serializers
from accounts.models import User
from .models import Organization, Project, Milestone, Task, TaskComment, File
from .utils import send_organization_member_email

class OrganizationSerializer(serializers.ModelSerializer):
    members = serializers.ListField(
        child=serializers.EmailField(), write_only=True, required=False
    )
    members_display = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ['id', 'name', 'description', 'owner', 'members', 'members_display']
        read_only_fields = ['owner', 'members_display']

    def get_members_display(self, obj):
        return [member.email for member in obj.members.all()]

    def validate(self, data):
        request = self.context.get('request')
        user = request.user

        if 'members' in data and self.instance and user != self.instance.owner:
            raise serializers.ValidationError("Only the owner can modify organization members.")

        return data

    def create(self, validated_data):
        members_emails = validated_data.pop('members', [])
        organization = Organization.objects.create(**validated_data)

        for email in members_emails:
            try:
                user = User.objects.get(email=email)
                organization.members.add(user)
                send_organization_member_email(email, organization, self.context['request'])
            except User.DoesNotExist:
                pass

        return organization

    def update(self, instance, validated_data):
        members_emails = validated_data.pop('members', [])
        organization = super().update(instance, validated_data)

        organization.members.clear()
        for email in members_emails:
            try:
                user = User.objects.get(email=email)
                organization.members.add(user)
                send_organization_member_email(email, organization, self.context['request'])
            except User.DoesNotExist:
                pass

        return organization



class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'organization', 'created_at', 'updated_at']

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'name', 'description', 'due_date', 'project', 'created_at', 'updated_at']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'file', 'due_date', 'milestone', 'assignee', 'completed', 'created_at', 'updated_at']

class TaskCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskComment
        fields = ['id', 'comment', 'created_at', 'updated_at', 'task', 'author']

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'task', 'file', 'uploaded_at']
