import string
from django.db import models
from accounts.models import User
from django.utils.crypto import get_random_string

def generate_unique_id():
    return get_random_string(length=6, allowed_chars=string.ascii_uppercase + string.digits)

class Organization(models.Model):
    id = models.CharField(max_length=6, primary_key=True, default=generate_unique_id, editable=False, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, related_name='owned_organizations', on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='organizations', blank=True, null=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    id = models.CharField(max_length=6, primary_key=True, default=generate_unique_id, editable=False, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    organization = models.ForeignKey(Organization, related_name='projects', on_delete=models.CASCADE)
    owner = models.ForeignKey(User, related_name='owned_projects', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Milestone(models.Model):
    id = models.CharField(max_length=6, primary_key=True, default=generate_unique_id, editable=False, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    due_date = models.DateField()
    project = models.ForeignKey(Project, related_name='milestones', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    id = models.CharField(max_length=6, primary_key=True, default=generate_unique_id, editable=False, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='tasks/files/')
    due_date = models.DateField()
    milestone = models.ForeignKey(Milestone, related_name='tasks', on_delete=models.CASCADE)
    assignee = models.ForeignKey(User, related_name='assigned_tasks', on_delete=models.SET_NULL, null=True, blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class TaskComment(models.Model):
    id = models.CharField(max_length=6, primary_key=True, default=generate_unique_id, editable=False, unique=True)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    task = models.ForeignKey(Task, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)

    def __str__(self):
        return f"Comment by {self.author} on {self.task}"

class File(models.Model):
    id = models.CharField(max_length=6, primary_key=True, default=generate_unique_id, editable=False, unique=True)
    task = models.ForeignKey(Task, related_name='files', on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"File {self.file.name} for Task {self.task.name}"
