from rest_framework import serializers
import hashlib

from django.apps import apps
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import connection
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt

from core.models import Agreement, SupportRequest, UserAgreementAcceptance
from investments.models import InvestmentPlan, UserInvestment
from investments.services import (
    approve_investment,
    create_investment,
    reject_investment,
)
from transactions.models import CryptocurrencyWallet, Transaction, VirtualCard
from transactions.services import (
    approve_transaction,
    create_transaction,
    create_virtual_card_request,
    reject_transaction,
)
from users.notification_service import mark_all_read as service_mark_all_read
from users.notification_service import (
    mark_notification_read as service_mark_notification_read,
)
from users.models import Profile, UserNotification, UserWallet
from users.services import (
    approve_kyc_application,
    reject_kyc_application,
    submit_document_info,
    submit_personal_info,
)
from users.verification import issue_verification_token, verify_token

from .serializers import (
    AdminKycApplicationSerializer,
    AdminTransactionSerializer,
    AdminUserInvestmentSerializer,
    AgreementSerializer,
    CryptocurrencyWalletSerializer,
    EmailPreferencesSerializer,
    InvestmentPlanSerializer,
    KycApplicationSerializer,
    KycDocumentSerializer,
    KycPersonalInfoSerializer,
    PlatformCertificateSerializer,
    TransactionSerializer,
    UserInvestmentSerializer,
    UserNotificationSerializer,
    UserWalletSerializer,
    VirtualCardSerializer,
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


class UserDashboardAnalyticsView(APIView):
    """Authenticated, user-scoped analytics for the dashboard.

    Descriptive only (counts and statuses). No projections.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        days_raw = request.query_params.get("days", "30")
        try:
            days = max(7, min(365, int(days_raw)))
        except (TypeError, ValueError):
            days = 30

        start_dt = timezone.now() - timezone.timedelta(days=days - 1)
        start_date = start_dt.date()

        def _scoped_queryset(model):
            """Prefer DB-enforced scoping (RLS) on Postgres; fall back to user filter."""

            if connection.vendor == "postgresql":
                return model.objects.all()
            return model.objects.filter(user=request.user)

        tx_qs = _scoped_queryset(Transaction).filter(created_at__date__gte=start_date)
        inv_qs = _scoped_queryset(UserInvestment).filter(created_at__date__gte=start_date)

        tx_by_day = {
            row["day"]: row["count"]
            for row in tx_qs.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
        }
        inv_by_day = {
            row["day"]: row["count"]
            for row in inv_qs.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
        }

        activity_over_time = []
        for offset in range(days):
            day = start_date + timezone.timedelta(days=offset)
            activity_over_time.append(
                {
                    "date": day.isoformat(),
                    "count": int(tx_by_day.get(day, 0)) + int(inv_by_day.get(day, 0)),
                }
            )

        tx_breakdown_rows = list(
            tx_qs.values("tx_type").annotate(count=Count("id"))
        )
        deposits = 0
        withdrawals = 0
        for row in tx_breakdown_rows:
            if row["tx_type"] == "deposit":
                deposits = int(row["count"])
            elif row["tx_type"] == "withdrawal":
                withdrawals = int(row["count"])

        inv_status_rows = list(
            _scoped_queryset(UserInvestment).values("status").annotate(count=Count("id"))
        )
        active = 0
        completed = 0
        pending = 0
        for row in inv_status_rows:
            status_val = row["status"]
            count_val = int(row["count"])
            if status_val == "approved":
                active += count_val
            elif status_val == "completed":
                completed += count_val
            elif status_val == "pending":
                pending += count_val

        tx_recent = list(
            _scoped_queryset(Transaction)
            .order_by("-created_at")
            .values("created_at", "tx_type", "status")[:10]
        )
        inv_recent = list(
            _scoped_queryset(UserInvestment)
            .select_related("plan")
            .order_by("-created_at")
            .values("created_at", "status", "plan__name")[:10]
        )

        recent_activity = []
        for row in tx_recent:
            created_at = row["created_at"]
            tx_type = row["tx_type"]
            recent_activity.append(
                {
                    "date": created_at.isoformat() if created_at else "",
                    "action_type": "Deposit" if tx_type == "deposit" else "Withdrawal",
                    "status": row["status"],
                }
            )
        for row in inv_recent:
            created_at = row["created_at"]
            plan_name = row.get("plan__name") or "Investment"
            recent_activity.append(
                {
                    "date": created_at.isoformat() if created_at else "",
                    "action_type": f"Investment ({plan_name})",
                    "status": row["status"],
                }
            )

        recent_activity.sort(key=lambda x: x["date"], reverse=True)
        recent_activity = recent_activity[:10]

        return Response(
            {
                "window_days": days,
                "activity_over_time": activity_over_time,
                "transaction_breakdown": {
                    "deposits": deposits,
                    "withdrawals": withdrawals,
                },
                "investment_status_overview": {
                    "active": active,
                    "completed": completed,
                    "pending": pending,
                },
                "recent_activity": recent_activity,
                "scoping": {
                    "db_vendor": connection.vendor,
                    "rls_expected": connection.vendor == "postgresql",
                },
            }
        )


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


@csrf_exempt
@api_view(["POST", "OPTIONS"])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """
    API endpoint for user login.
    - Publicly accessible (AllowAny, no authentication required)
    - CSRF exempt for token/JWT auth
    - Returns 401 for inactive/unverified users
    """
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
    # Early lookup to distinguish inactive from bad credentials
    from django.contrib.auth import get_user_model
    UserModel = get_user_model()
    existing = UserModel.objects.filter(email=email).first()
    if existing and not existing.is_active:
        # Offer resend flow to inactive accounts
        return Response(
            {
                "error": "Account not verified. Check your email or resend.",
                "inactive": True,
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Authenticate user normally
    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    if not user.is_active:
        return Response(
            {"error": "Account not verified. Please check your email for a verification link or resend it.", "inactive": True},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    login(request, user)
    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        {
            "success": True,
            "token": token.key,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
        }
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
    profile = getattr(user, "profile", None)
    email_verified = bool(getattr(profile, "email_verified", False))
    return Response({
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
        "email_verified": email_verified,
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
    profile = getattr(user, "profile", None)
    email_verified = bool(getattr(profile, "email_verified", False))
    return Response({
        "valid": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email_verified": email_verified,
        }
    })


class CryptoWalletViewSet(viewsets.ReadOnlyModelViewSet):
    """Public listing of active company cryptocurrency deposit addresses."""

    queryset = CryptocurrencyWallet.objects.filter(is_active=True).order_by("currency")
    serializer_class = CryptocurrencyWalletSerializer
    permission_classes = [permissions.AllowAny]


class VirtualCardViewSet(viewsets.GenericViewSet):
    """User endpoints to list and request virtual cards (pending -> approved)."""

    serializer_class = VirtualCardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VirtualCard.objects.filter(user=self.request.user).order_by("-created_at")

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        amount = request.data.get("purchase_amount")
        notes = (request.data.get("notes") or "").strip()

        try:
            amount_val = float(amount)
        except (TypeError, ValueError):
            return Response({"error": "Valid purchase_amount is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            card = create_virtual_card_request(request.user, amount_val, notes)
        except DjangoValidationError as exc:
            raise ValidationError(exc.messages)

        output = self.get_serializer(card)
        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)


class PublicCertificateView(APIView):
    """Public endpoint exposing the latest active platform certificate."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        PlatformCertificateModel = apps.get_model("core", "PlatformCertificate")
        cert = (
            PlatformCertificateModel.objects.filter(is_active=True)
            .order_by("-created_at")
            .first()
        )
        if not cert:
            return Response({"detail": "No active certificate configured."}, status=status.HTTP_404_NOT_FOUND)
        serializer = PlatformCertificateSerializer(cert)
        return Response(serializer.data)


class KycApplicationViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """User-facing endpoints for managing their KYC application."""

    serializer_class = KycApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        KycApplicationModel = apps.get_model("users", "KycApplication")
        return KycApplicationModel.objects.filter(user=self.request.user).order_by("-created_at")

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

    serializer_class = AdminKycApplicationSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        KycApplicationModel = apps.get_model("users", "KycApplication")
        return KycApplicationModel.objects.select_related("user", "reviewed_by").order_by(
            "-created_at"
        )

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


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def resend_verification(request):
    """Resend email verification link for an inactive account. Idempotent."""
    serializer = ResendVerificationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data["email"].strip()
    from django.contrib.auth import get_user_model
    UserModel = get_user_model()
    user = UserModel.objects.filter(email=email).first()
    if not user:
        return Response({"success": True, "message": "If an account exists, a verification email has been sent."}, status=status.HTTP_200_OK)
    if user.is_active:
        return Response({"success": True, "message": "Account already verified. You can log in."}, status=status.HTTP_200_OK)
    # Issue a fresh token and send email
    issue_verification_token(user)
    return Response({"success": True, "message": "Verification email resent. Please check your inbox."}, status=status.HTTP_200_OK)


class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)
    referral_code = serializers.CharField(required=False, allow_blank=True)


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def complete_signup(request):
    """Signup: create user, send verification link. Prevents duplicate inactive users."""
    serializer = SignupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data["email"].strip()
    password = serializer.validated_data["password"]
    referral_code = serializer.validated_data.get("referral_code", "").strip()

    from django.contrib.auth import get_user_model
    User = get_user_model()

    # Prevent duplicate signup for existing users (active or inactive)
    existing = User.objects.filter(email=email).first()
    if existing:
        if not existing.is_active:
            return Response({"error": "An account with this email already exists but is not yet verified. Please check your email for a verification link or resend it."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    # Create new inactive user
    try:
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            is_active=False
        )
    except Exception as e:
        return Response({"error": f"Failed to create account: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    # Attach referral if a valid code was provided
    referral_attached = False
    if referral_code:
        try:
            from referrals.services import create_referral_if_code
            ref = create_referral_if_code(user, referral_code)
            if ref:
                referral_attached = True
        except Exception:
            pass

    # Send verification email
    issue_verification_token(user)
    return Response({"status": "verification_sent", "referral_attached": referral_attached}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["GET"])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def verify_email_link(request):
    """
    Verify email token and activate user account.
    - Idempotent: safe to call multiple times
    - Activates user and sets is_active, is_verified, email_verified if present
    - Returns success if already verified
    """
    """
    Verify email token and activate user account.
    Returns JSON response with success status and redirect URL.
    """
    import logging
    logger = logging.getLogger(__name__)

    token = request.GET.get("token", "")
    if token:
        logger.info(
            "Email verification attempt with token prefix: %s...",
            token[:10],
        )
    else:
        logger.info("Email verification attempt with no token provided")

    public_site_url = str(getattr(settings, "PUBLIC_SITE_URL", "") or "").rstrip("/")
    login_redirect = f"{public_site_url}/accounts/login" if public_site_url else "/accounts/login"
    signup_redirect = f"{public_site_url}/accounts/signup" if public_site_url else "/accounts/signup"

    if not token:
        logger.warning("Email verification failed: No token provided")
        return Response(
            {
                "success": False,
                "error": "Verification token is required.",
                "redirect_url": signup_redirect,
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        ev = verify_token(token)
        if ev:
            user = ev.user
            # Explicitly activate and set all relevant fields
            updated = False
            if not user.is_active:
                user.is_active = True
                updated = True
            if hasattr(user, "is_verified") and not getattr(user, "is_verified", False):
                user.is_verified = True
                updated = True
            if hasattr(user, "email_verified") and not getattr(user, "email_verified", False):
                user.email_verified = True
                updated = True
            if updated:
                user.save()
            logger.info(f"Email verification successful for user: {user.email}")
            return Response({
                "success": True,
                "message": "Email verified successfully! You can now log in to your account.",
                "redirect_url": f"{login_redirect}?verified=1",
            }, status=status.HTTP_200_OK)

        # If token is used/expired, check if user is already active
        EmailVerification = apps.get_model("users", "EmailVerification")
        ev_any = EmailVerification.objects.filter(token=token).order_by("-created_at").first()
        if ev_any and ev_any.user.is_active:
            logger.info("Email verification token already used; user %s is active", ev_any.user.email)
            return Response({
                "success": True,
                "message": "Your email is already verified. You can now log in.",
                "redirect_url": login_redirect,
            }, status=status.HTTP_200_OK)

        logger.warning("Email verification failed: Invalid or expired token")
        return Response({
            "success": False,
            "error": "Invalid or expired verification link. Please request a new one.",
            "redirect_url": signup_redirect,
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Email verification error: {str(e)}", exc_info=True)
        return Response({
            "success": False,
            "error": f"Verification failed: {str(e)}",
            "redirect_url": signup_redirect,
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
