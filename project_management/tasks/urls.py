from django.urls import path
from tasks.views import (
    OrganizationListCreateView, OrganizationDetailView,
    ProjectListCreateView, ProjectDetailView,
    MilestoneListCreateView, MilestoneDetailView,
    TaskListCreateView, TaskDetailView,
    TaskCommentListCreateView, TaskCommentDetailView,
    MilestoneListWithTasksView, milestone_task_progress
)

urlpatterns = [
    path('organizations/', OrganizationListCreateView.as_view(), name='organization-list-create'),
    path('organizations/<str:pk>/', OrganizationDetailView.as_view(), name='organization-detail'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<str:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('milestones/', MilestoneListCreateView.as_view(), name='milestone-list-create'),
    path('milestones/<str:pk>/', MilestoneDetailView.as_view(), name='milestone-detail'),
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<str:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('task-comments/', TaskCommentListCreateView.as_view(), name='task-comment-list-create'),
    path('task-comments/<str:pk>/', TaskCommentDetailView.as_view(), name='task-comment-detail'),
    path('analystics/', MilestoneListWithTasksView.as_view(), name='milestone-list-with-tasks'),
    path('analystics/<str:milestone_id>/progress/', milestone_task_progress, name='milestone-task-progress'),

]
