from django.urls import path

from .views import TaskDetail, TaskListCreate, UserRegisterView,UserListView,AssignedTaskList,TaskCompletionUpdate,CurrentUserView,NotificationDetailView,NotificationListView


urlpatterns = [
    path('tasks/', TaskListCreate.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetail.as_view(), name='task-detail'),
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('tasks/assigned/',AssignedTaskList.as_view(),name='assigned-task-list'),
    path('tasks/<int:pk>/completion/',TaskCompletionUpdate.as_view(),name='task-completion'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('notifications/', NotificationListView.as_view()),
    path('notifications/<int:pk>/', NotificationDetailView.as_view()),
]