from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Allow JWT login with email and password."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove the username field requirement, add email
        self.fields.pop(self.username_field, None)
        self.fields['email'] = serializers.EmailField(required=True)
        self.fields['password'] = serializers.CharField(
            required=True, write_only=True, trim_whitespace=False
        )

    def validate(self, attrs):
        User = get_user_model()
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError('Email and password are required.')

        # Find user by email
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            raise serializers.ValidationError('No account found with this email.')

        if not user.check_password(password):
            raise serializers.ValidationError('Incorrect password.')

        if not user.is_active:
            raise serializers.ValidationError('This account is inactive.')

        # Inject username so parent token generation works
        attrs[self.username_field] = getattr(user, self.username_field)
        attrs['password'] = password

        return super().validate(attrs)


class EmailOrUsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer
