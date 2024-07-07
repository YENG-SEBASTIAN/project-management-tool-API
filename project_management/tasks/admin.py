# admin.py
from django.contrib import admin
from tasks.models import Organization, MemberEmail, Project, Milestone, Task, TaskComment, TaskLog


@admin.register(MemberEmail)
class MemberEmailAdmin(admin.ModelAdmin):
    list_display = ('email',)
    search_fields = ('email',)

# Register the Organization model in the admin
@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'owner')
    filter_horizontal = ('members_emails',) 
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'owner', 'created_at', 'updated_at']
    search_fields = ['name', 'owner__username']
    list_filter = ['created_at', 'updated_at']

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'due_date', 'project', 'created_at', 'updated_at']
    search_fields = ['name', 'project__name']
    list_filter = ['due_date', 'created_at', 'updated_at']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'milestone', 'assignee', 'completed', 'created_at', 'updated_at']
    search_fields = ['name', 'milestone__name', 'assignee__username']
    list_filter = ['completed', 'created_at', 'updated_at']

@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'task', 'user', 'comment', 'created_at']
    search_fields = ['task__name', 'user__username', 'comment']
    list_filter = ['created_at']

@admin.register(TaskLog)
class TaskLogAdmin(admin.ModelAdmin):
    list_display = ['id', 'task', 'user', 'action', 'timestamp']
    search_fields = ['task__name', 'user__username', 'action']
    list_filter = ['timestamp']
