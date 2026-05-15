from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Allow JWT login with either email or username."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field].required = False
        self.fields['email'] = self.fields.get('email', __import__('rest_framework').serializers.EmailField(required=False))

    def validate(self, attrs):
        email = attrs.get("email")
        username = attrs.get(self.username_field)

        if email and not username:
            User = get_user_model()
            user = (
                User.objects
                .filter(email__iexact=email)
                .only(self.username_field)
                .first()
            )
            if user:
                attrs[self.username_field] = getattr(user, self.username_field)

        return super().validate(attrs)


class EmailOrUsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer
