from django.contrib.auth.models import User
from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    due_date = models.DateTimeField(
        null=True,
        blank=True,
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='owned_tasks',
        null=True,
        blank=True,
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='assigned_tasks',
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('assigned', 'Task Assigned'),
        ('reminder', 'Deadline Reminder'),
        ('overdue', 'Task Overdue'),
        ('completed', 'Task Completed'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications',
    )

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='notifications',
    )

    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
    )

    message = models.CharField(max_length=255)

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.message}'