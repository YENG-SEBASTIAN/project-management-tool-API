from rest_framework import serializers
from accounts.models import User
from tasks.models import Organization, MemberEmail, Project, Milestone, Task, TaskComment, TaskLog
from tasks.utils import send_organization_member_email



class OrganizationSerializer(serializers.ModelSerializer):
    members_emails = serializers.ListField(
        child=serializers.EmailField(), write_only=True
    )

    class Meta:
        model = Organization
        fields = ['id', 'name', 'description', 'owner', 'members_emails']
        read_only_fields = ['owner']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user

        if 'members_emails' in data and self.instance and user != self.instance.owner:
            raise serializers.ValidationError("Only the owner can modify organization members.")

        return data

    def create(self, validated_data):
        members_emails = validated_data.pop('members_emails', [])
        organization = Organization.objects.create(**validated_data)

        for email in members_emails:
            member_email, created = MemberEmail.objects.get_or_create(email=email)
            organization.members_emails.add(member_email)
            # Send email to the member
            send_organization_member_email(email, organization, self.context['request'])

        return organization

    def update(self, instance, validated_data):
        members_emails = validated_data.pop('members_emails', [])
        organization = super().update(instance, validated_data)

        # Clear existing members and add the new ones
        organization.members_emails.clear()
        for email in members_emails:
            member_email, created = MemberEmail.objects.get_or_create(email=email)
            organization.members_emails.add(member_email)
            # Send email to the member
            send_organization_member_email(email, organization, self.context['request'])

        return organization
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'organization', 'created_at', 'updated_at']

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'name', 'due_date', 'project', 'created_at', 'updated_at']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'milestone', 'assignee', 'completed', 'created_at', 'updated_at']

class TaskCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskComment
        fields = ['id', 'task', 'user', 'comment', 'created_at']

class TaskLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskLog
        fields = ['id', 'task', 'user', 'action', 'timestamp']
