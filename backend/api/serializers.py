from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import Task


class TaskSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(
        source='owner.username',
        read_only=True,
    )

    assigned_to_username = serializers.CharField(
        source='assigned_to.username',
        read_only=True,
    )

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'completed',
            'owner',
            'owner_username',
            'assigned_to',
            'due_date',
            'assigned_to_username',
        ]

        read_only_fields = [
            'id',
            'owner',
            'owner_username',
            'assigned_to_username',
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['id']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )

        return user