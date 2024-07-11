from django.contrib import admin
from .models import Organization, Project, Milestone, Task, TaskComment, File

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'owner')
    filter_horizontal = ('members',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'organization', 'owner', 'created_at', 'updated_at']
    search_fields = ['name', 'organization__name', 'owner__username']
    list_filter = ['created_at', 'updated_at']

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'due_date', 'project', 'created_at', 'updated_at']
    search_fields = ['name', 'project__name']
    list_filter = ['due_date', 'created_at', 'updated_at']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'file', 'due_date', 'milestone', 'assignee', 'created_at', 'updated_at']
    search_fields = ['name', 'milestone__name', 'assignee__username']
    list_filter = ['due_date', 'created_at', 'updated_at']

@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'task', 'author', 'comment', 'created_at', 'updated_at']
    search_fields = ['task__name', 'author__username', 'comment']
    list_filter = ['created_at', 'updated_at']

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ['id', 'task', 'file', 'uploaded_at']
    search_fields = ['task__name', 'file']
    list_filter = ['uploaded_at']
