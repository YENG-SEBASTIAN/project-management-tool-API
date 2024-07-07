# urls.py

from django.urls import path
from tasks.views import (
    OrganizationListCreateView,
    OrganizationDetailView,
    ProjectListCreateView,
    ProjectDetailView,
    MilestoneListCreateView,
    MilestoneDetailView,
    TaskListCreateView,
    TaskDetailView,
    TaskCommentListCreateView,
    TaskCommentDetailView,
)

urlpatterns = [
    path('organizations/', OrganizationListCreateView.as_view(), name='organization-list-create'),
    path('organizations/<int:pk>/', OrganizationDetailView.as_view(), name='organization-detail'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('milestones/', MilestoneListCreateView.as_view(), name='milestone-list-create'),
    path('milestones/<int:pk>/', MilestoneDetailView.as_view(), name='milestone-detail'),
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('task-comments/', TaskCommentListCreateView.as_view(), name='task-comment-list-create'),
    path('task-comments/<int:pk>/', TaskCommentDetailView.as_view(), name='task-comment-detail'),
]
