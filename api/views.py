import hashlib

from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError as DjangoValidationError
from django.shortcuts import get_object_or_404
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Agreement, SupportRequest, UserAgreementAcceptance
from investments.models import InvestmentPlan, UserInvestment
from investments.services import (
    approve_investment,
    create_investment,
    reject_investment,
)
from transactions.models import CryptocurrencyWallet, Transaction
from transactions.services import (
    approve_transaction,
    create_transaction,
    reject_transaction,
)
from users.models import KycApplication, Profile, UserNotification, UserWallet
from users.notification_service import mark_all_read as service_mark_all_read
from users.notification_service import (
    mark_notification_read as service_mark_notification_read,
)
from users.services import (
    approve_kyc_application,
    reject_kyc_application,
    submit_document_info,
    submit_personal_info,
)

from .serializers import (
    AdminTransactionSerializer,
    AdminUserInvestmentSerializer,
    AdminKycApplicationSerializer,
    AgreementSerializer,
    CryptocurrencyWalletSerializer,
    EmailPreferencesSerializer,
    InvestmentPlanSerializer,
    KycApplicationSerializer,
    KycDocumentSerializer,
    KycPersonalInfoSerializer,
    TransactionSerializer,
    UserInvestmentSerializer,
    UserNotificationSerializer,
    UserWalletSerializer,
)


class AgreementViewSet(viewsets.ReadOnlyModelViewSet):
    """Expose active legal agreements and handle user acceptance."""

    queryset = Agreement.objects.filter(is_active=True).order_by("-effective_date", "-created_at")
    serializer_class = AgreementSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        agreement = self.get_object()
        user = request.user

        acceptance, created = UserAgreementAcceptance.objects.get_or_create(
            user=user,
            agreement=agreement,
            defaults={
                "ip_address": (request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0] or request.META.get("REMOTE_ADDR")),
                "user_agent": request.META.get("HTTP_USER_AGENT", ""),
                "agreement_hash": hashlib.sha256(agreement.body.encode("utf-8")).hexdigest(),
                "agreement_version": agreement.version,
            },
        )

        if not created and acceptance.agreement_hash == "":
            acceptance.agreement_hash = hashlib.sha256(agreement.body.encode("utf-8")).hexdigest()
            acceptance.agreement_version = agreement.version
            acceptance.save(update_fields=["agreement_hash", "agreement_version"])

        serializer = self.get_serializer(agreement, context={**self.get_serializer_context(), "request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class InvestmentPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """Public endpoint for investment plans"""

    queryset = InvestmentPlan.objects.all()
    serializer_class = InvestmentPlanSerializer
    permission_classes = [permissions.AllowAny]


class UserInvestmentViewSet(viewsets.ModelViewSet):
    """User investments endpoint"""

    serializer_class = UserInvestmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserInvestment.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        plan = get_object_or_404(InvestmentPlan, id=serializer.validated_data["plan_id"])
        amount = serializer.validated_data["amount"]

        try:
            investment = create_investment(request.user, plan, amount)
        except DjangoValidationError as exc:
            raise ValidationError(exc.messages)

        output_serializer = self.get_serializer(investment)
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class TransactionViewSet(viewsets.ModelViewSet):
    """User transactions endpoint"""

    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated = serializer.validated_data

        try:
            txn = create_transaction(
                user=request.user,
                tx_type=validated["tx_type"],
                amount=validated["amount"],
                reference=validated["reference"],
                payment_method=validated.get("payment_method", "bank_transfer"),
                tx_hash=validated.get("tx_hash", ""),
                wallet_address_used=validated.get("wallet_address_used", ""),
            )
        except DjangoValidationError as exc:
            raise ValidationError(exc.messages)

        output_serializer = self.get_serializer(txn)
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class WalletView(APIView):
    """User wallet endpoint"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wallet, created = UserWallet.objects.get_or_create(user=request.user)
        serializer = UserWalletSerializer(wallet)
        return Response(serializer.data)


class AdminTransactionViewSet(viewsets.ModelViewSet):
    """Admin transactions management endpoint"""

    queryset = Transaction.objects.all()
    serializer_class = AdminTransactionSerializer
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        target_status = request.data.get("status")
        notes = request.data.get("notes", "")

        if target_status and target_status != instance.status:
            try:
                if target_status == "approved":
                    approve_transaction(instance, request.user, notes)
                elif target_status == "rejected":
                    reject_transaction(instance, request.user, notes)
                else:
                    raise ValidationError("Unsupported status change requested.")
            except DjangoValidationError as exc:
                raise ValidationError(exc.messages)

            instance.refresh_from_db()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        kwargs["partial"] = partial
        return super().update(request, *args, **kwargs)


class AdminUserInvestmentViewSet(viewsets.ModelViewSet):
    """Admin investments management endpoint"""

    queryset = UserInvestment.objects.all()
    serializer_class = AdminUserInvestmentSerializer
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        target_status = request.data.get("status")
        notes = request.data.get("notes", "")

        if target_status and target_status != instance.status:
            try:
                if target_status == "approved":
                    approve_investment(instance, request.user, notes)
                elif target_status == "rejected":
                    reject_investment(instance, request.user, notes)
                else:
                    raise ValidationError("Unsupported status change requested.")
            except DjangoValidationError as exc:
                raise ValidationError(exc.messages)

            instance.refresh_from_db()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        kwargs["partial"] = partial
        return super().update(request, *args, **kwargs)


class SupportRequestView(APIView):
    """Endpoint for submitting support requests from the frontend."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.data or {}

        message = (payload.get("message") or "").strip()
        if not message:
            return Response({"error": "Support message cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        topic = (payload.get("topic") or "").strip()
        source_url = (payload.get("source_url") or request.META.get("HTTP_REFERER") or "").strip()
        contact_email = (payload.get("contact_email") or "").strip()
        full_name = (payload.get("full_name") or "").strip()
        current_user = request.user if request.user.is_authenticated else None

        if current_user:
            if not contact_email:
                contact_email = current_user.email or ""
            if not full_name:
                profile_name = getattr(getattr(current_user, "profile", None), "full_name", "")
                full_name = current_user.get_full_name() or profile_name or current_user.email
        elif not contact_email:
            return Response(
                {"error": "Please include an email so our team can respond."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        forwarded_for = (request.META.get("HTTP_X_FORWARDED_FOR") or "").split(",")
        ip_address = (
            forwarded_for[0].strip()
            if forwarded_for and forwarded_for[0].strip()
            else request.META.get("REMOTE_ADDR")
        )

        support_request = SupportRequest.objects.create(
            user=current_user,
            full_name=full_name,
            contact_email=contact_email,
            topic=topic,
            source_url=source_url,
            message=message,
            ip_address=ip_address,
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )

        return Response(
            {
                "status": "received",
                "reference": str(support_request.pk),
                "detail": "Our support team will review and respond shortly.",
            },
            status=status.HTTP_201_CREATED,
        )


class UserNotificationViewSet(viewsets.GenericViewSet):
    """User notification endpoints for list and state updates."""

    serializer_class = UserNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserNotification.objects.filter(user=self.request.user).order_by("-created_at")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        unread_only = (request.query_params.get("unread_only") or "").lower() in {"1", "true", "yes"}
        if unread_only:
            queryset = queryset.filter(is_read=False)

        limit_param = request.query_params.get("limit")
        if limit_param:
            try:
                limit_value = int(limit_param)
                if limit_value > 0:
                    queryset = queryset[:limit_value]
            except ValueError:
                pass

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        notification = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        updated = service_mark_notification_read(pk, request.user)
        if updated is None:
            return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(updated)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        updated_count = service_mark_all_read(request.user)
        return Response({"updated": updated_count})

    @action(detail=False, methods=["get"], url_path="unread-count")
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({"count": count})


class EmailPreferencesView(APIView):
    """Read and update the authenticated user's email notification preferences."""

    permission_classes = [permissions.IsAuthenticated]

    def _get_profile(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return profile

    def get(self, request):
        profile = self._get_profile(request)
        serializer = EmailPreferencesSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = self._get_profile(request)
        serializer = EmailPreferencesSerializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request):
        profile = self._get_profile(request)
        serializer = EmailPreferencesSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


@api_view(["POST", "OPTIONS"])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """API endpoint for user login."""
    if request.method == "OPTIONS":
        return Response(status=status.HTTP_200_OK)

    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Authenticate user
    user = authenticate(request, username=email, password=password)

    if user is not None:
        login(request, user)
        # Create or get token for the user
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "success": True,
            "token": token.key,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        })
    else:
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """API endpoint for user logout."""
    # Delete the user's token
    try:
        request.user.auth_token.delete()
    except (AttributeError, Token.DoesNotExist):
        pass

    logout(request)
    return Response({"success": True, "message": "Logged out successfully."})


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def current_user_view(request):
    """Get current authenticated user details."""
    user = request.user
    return Response({
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    })


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def token_generate_view(request):
    """Generate a new authentication token for a user."""
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Authenticate user
    user = authenticate(request, username=email, password=password)

    if user is not None:
        # Delete old token and create a new one
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)

        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        })
    else:
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def token_refresh_view(request):
    """Refresh (regenerate) the authentication token for the current user."""
    user = request.user

    # Delete old token and create a new one
    Token.objects.filter(user=user).delete()
    token = Token.objects.create(user=user)

    return Response({
        "token": token.key,
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
    })


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def token_verify_view(request):
    """Verify that the current token is valid."""
    user = request.user
    return Response({
        "valid": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
    })


class CryptoWalletViewSet(viewsets.ReadOnlyModelViewSet):
    """Public listing of active company cryptocurrency deposit addresses."""

    queryset = CryptocurrencyWallet.objects.filter(is_active=True).order_by("currency")
    serializer_class = CryptocurrencyWalletSerializer
    permission_classes = [permissions.AllowAny]


class KycApplicationViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """User-facing endpoints for managing their KYC application."""

    serializer_class = KycApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return KycApplication.objects.filter(user=self.request.user).order_by("-created_at")

    @action(detail=False, methods=["post"], url_path="personal-info")
    def submit_personal_info(self, request):
        serializer = KycPersonalInfoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Wrap Django ValidationError from service layer to return proper 400 instead of 500
        try:
            application = submit_personal_info(request.user, serializer.validated_data)
        except DjangoValidationError as exc:
            raise ValidationError(exc.messages)
        output = self.get_serializer(application)
        return Response(output.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="documents")
    def submit_documents(self, request):
        serializer = KycDocumentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            application = submit_document_info(request.user, serializer.validated_data)
        except DjangoValidationError as exc:
            raise ValidationError(exc.messages)
        output = self.get_serializer(application)
        return Response(output.data, status=status.HTTP_200_OK)


class AdminKycApplicationViewSet(viewsets.ModelViewSet):
    """Admin endpoints for reviewing and updating KYC applications."""

    queryset = KycApplication.objects.select_related("user", "reviewed_by").order_by("-created_at")
    serializer_class = AdminKycApplicationSerializer
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        target_status = request.data.get("status")
        notes = request.data.get("notes", "")
        reason = request.data.get("reason", "")

        if target_status and target_status != instance.status:
            try:
                if target_status == "approved":
                    approve_kyc_application(instance, request.user, notes)
                elif target_status == "rejected":
                    reject_kyc_application(instance, request.user, reason or notes)
                else:
                    raise ValidationError("Unsupported status change requested.")
            except DjangoValidationError as exc:
                raise ValidationError(exc.messages)

            instance.refresh_from_db()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        kwargs["partial"] = partial
        return super().update(request, *args, **kwargs)
