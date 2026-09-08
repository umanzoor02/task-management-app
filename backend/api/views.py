from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Task
from .serializers import TaskSerializer, UserRegisterSerializer,UserSerializer


class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Task.objects.filter(
            owner=user
        ).order_by('-id')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class AssignedTaskList(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(
            assigned_to=self.request.user
        ).order_by('-id')

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.exclude(
            id=self.request.user.id
        ).order_by('username')

class TaskCompletionUpdate(generics.UpdateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['patch']

    def get_queryset(self):
        return Task.objects.filter(
            assigned_to=self.request.user
        )

    def update(self, request, *args, **kwargs):
        task = self.get_object()

        # Assignees are only allowed to update completion status
        if set(request.data.keys()) != {'completed'}:
            raise PermissionDenied(
                'You can only update the completion status of this task.'
            )

        serializer = self.get_serializer(
            task,
            data={'completed': request.data['completed']},
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)