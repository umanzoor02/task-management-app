from django.urls import path

from .views import TaskDetail, TaskListCreate, UserRegisterView


urlpatterns = [
    path('tasks/', TaskListCreate.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetail.as_view(), name='task-detail'),
    path('register/', UserRegisterView.as_view(), name='user-register'),
]