from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Allow JWT login with either email or username."""

    email = serializers.EmailField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Allow email-only login; username will be resolved from email.
        self.fields[self.username_field].required = False

    def validate(self, attrs):
        data = dict(attrs)
        email = data.get("email")
        username = data.get(self.username_field)

        if email and not username:
            user = (
                get_user_model()
                .objects.filter(email__iexact=email)
                .only(self.username_field)
                .first()
            )
            if user:
                data[self.username_field] = getattr(user, self.username_field)

        return super().validate(data)


class EmailOrUsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer
