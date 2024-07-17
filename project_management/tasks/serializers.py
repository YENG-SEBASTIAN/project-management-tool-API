from rest_framework import serializers
from accounts.models import User
from tasks.utils import send_organization_member_email
from tasks.models import Organization, Project, Milestone, Task, TaskComment, File
from accounts.serializers import CustomUserSerializer


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

        for email in members_emails:
            try:
                user = User.objects.get(email=email)
                organization.members.add(user)
                send_organization_member_email(email, organization, self.context['request'])
            except User.DoesNotExist:
                pass

        return organization


class ProjectSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    organization_detail = OrganizationSerializer(read_only=True, source='organization')

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'organization', 'organization_name', 'organization_detail', 'created_at', 'updated_at']



class MilestoneSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = Milestone
        fields = ['id', 'name', 'description', 'start_date', 'due_date', 'project', 'project_name', 'created_at', 'updated_at']

class TaskSerializer(serializers.ModelSerializer):
    milestone_details = MilestoneSerializer(source='milestone', read_only=True)
    assignee_email = serializers.CharField(write_only=True, required=False)
    assignee = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'file', 'start_date', 'due_date', 'milestone', 'milestone_details', 'assignee_email', 'assignee', 'completed', 'created_at', 'updated_at']
        
        
class TaskCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskComment
        fields = ['id', 'comment', 'created_at', 'updated_at', 'task', 'author']

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'task', 'file', 'uploaded_at']
