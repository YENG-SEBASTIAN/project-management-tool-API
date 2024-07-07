
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_task_assignment_email(task):
    subject = 'You have been assigned a new task'
    html_message = render_to_string('task_assignment_email.html', {'task': task})
    plain_message = strip_tags(html_message)
    from_email = settings.EMAIL_HOST_USER
    to_email = task.assignee.email

    send_mail(
        subject,
        plain_message,
        from_email,
        [to_email],
        html_message=html_message,
        fail_silently=False,
    )

def send_organization_member_email(user, organization, request):
    subject = 'You have been added to a new organization'
    frontend_url = request.frontend_base_url
    html_message = render_to_string('organization_member_email.html', {'user': user, 'organization': organization, 'frontend_url': frontend_url})
    plain_message = strip_tags(html_message)
    from_email = settings.EMAIL_HOST_USER
    to_email = user.email

    send_mail(
        subject,
        plain_message,
        from_email,
        [to_email],
        html_message=html_message,
        fail_silently=False,
    )
