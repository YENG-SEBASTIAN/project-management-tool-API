# utils.py

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_task_assignment_email(task):
    subject = 'You have been assigned a new task'
    html_message = render_to_string('task_assignment_email.html', {'task': task})
    plain_message = strip_tags(html_message)
    from_email = 'from@example.com'
    to_email = task.assignee.email

    send_mail(
        subject,
        plain_message,
        from_email,
        [to_email],
        html_message=html_message,
        fail_silently=False,
    )
