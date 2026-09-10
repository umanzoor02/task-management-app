from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import Notification, Task


class Command(BaseCommand):
    help = 'Create reminder and overdue notifications for tasks'

    def handle(self, *args, **options):
        now = timezone.now()
        reminder_limit = now + timedelta(hours=24)

        tasks = Task.objects.filter(
            completed=False,
            due_date__isnull=False,
        )

        for task in tasks:
            # Task is already overdue
            if task.due_date < now:
                if task.assigned_to:
                    Notification.objects.get_or_create(
                        user=task.assigned_to,
                        task=task,
                        notification_type='overdue',
                        defaults={
                            'message': f'"{task.title}" is overdue.'
                        },
                    )

            # Task is due within the next 24 hours
            elif task.due_date <= reminder_limit:
                if task.assigned_to:
                    Notification.objects.get_or_create(
                        user=task.assigned_to,
                        task=task,
                        notification_type='reminder',
                        defaults={
                            'message': f'"{task.title}" is due within 24 hours.'
                        },
                    )

        self.stdout.write(
            self.style.SUCCESS('Task deadline check completed.')
        )