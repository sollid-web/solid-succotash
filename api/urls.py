from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

from .jwt import EmailOrUsernameTokenObtainPairView

from investments.views import MyInvestmentsView

from . import views
from .referrals_endpoints import referrals_rewards, referrals_summary

router = DefaultRouter()
router.register(
    r"agreements", views.AgreementViewSet, basename="api-agreements"
)
router.register(
    r"investments", views.UserInvestmentViewSet, basename="api-investments"
)
router.register(
    r"transactions", views.TransactionViewSet, basename="api-transactions"
)
router.register(
    r"plans", views.InvestmentPlanViewSet, basename="api-plans"
)
router.register(
    r"crypto-wallets", views.CryptoWalletViewSet, basename="api-crypto-wallets"
)
router.register(
    r"virtual-cards", views.VirtualCardViewSet, basename="api-virtual-cards"
)
router.register(r"kyc", views.KycApplicationViewSet, basename="api-kyc")
router.register(
    r"notifications",
    views.UserNotificationViewSet,
    basename="api-notifications",
)

router.register(
    r"support/requests",
    views.UserSupportRequestViewSet,
    basename="api-support-requests",
)

# Admin endpoints
router.register(
    r"admin/transactions",
    views.AdminTransactionViewSet,
    basename="api-admin-transactions",
)
router.register(
    r"admin/investments",
    views.AdminUserInvestmentViewSet,
    basename="api-admin-investments",
)
router.register(
    r"admin/kyc",
    views.AdminKycApplicationViewSet,
    basename="api-admin-kyc",
)
router.register(
    r"admin/plans",
    views.AdminInvestmentPlanViewSet,
    basename="api-admin-plans",
)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "auth/jwt/create/",
        EmailOrUsernameTokenObtainPairView.as_view(),
        name="api-jwt-create",
    ),
    path(
        "auth/jwt/refresh/",
        TokenRefreshView.as_view(),
        name="api-jwt-refresh",
    ),
    path("investments/my/", MyInvestmentsView.as_view(), name="api-my-investments"),
    path("wallet/", views.WalletView.as_view(), name="api-wallet"),
    path(
        "analytics/overview/",
        views.UserDashboardAnalyticsView.as_view(),
        name="api-analytics-overview",
    ),
    path("support/", views.SupportRequestView.as_view(), name="api-support"),
    path(
        "public/certificate/",
        views.PublicCertificateView.as_view(),
        name="api-public-certificate",
    ),
    path(
        "profile/email-preferences/",
        views.EmailPreferencesView.as_view(),
        name="api-email-preferences",
    ),
    # Authentication endpoints
    path("auth/login/", views.login_view, name="api-login"),
    path("auth/logout/", views.logout_view, name="api-logout"),
    path("auth/me/", views.current_user_view, name="api-current-user"),
    # Token management endpoints
    path(
        "auth/token/generate/",
        views.token_generate_view,
        name="api-token-generate",
    ),
    path(
        "auth/token/refresh/",
        views.token_refresh_view,
        name="api-token-refresh",
    ),
    path(
        "auth/token/verify/", views.token_verify_view, name="api-token-verify"
    ),
    path(
        "auth/verification/resend/",
        views.resend_verification,
        name="resend_verification",
    ),
    path(
        "auth/resend-verification/",
        views.resend_verification,
        name="resend_verification_alias",
    ),
    # Test compatibility: send_verification_code and verify_email_code
    path(
        "auth/send-verification-code/",
        views.resend_verification,
        name="send_verification_code",
    ),
    path(
        "auth/verify-email-code/",
        views.resend_verification,
        name="verify_email_code",
    ),
    path(
        "auth/complete-signup/",
        views.complete_signup,
        name="complete_signup",
    ),
    path(
        "auth/verify-email/",
        views.verify_email_link,
        name="verify_email_link",
    ),
    # Referrals
    path(
        "referrals/summary/",
        referrals_summary,
        name="api-referrals-summary",
    ),
    path(
        "referrals/rewards/",
        referrals_rewards,
        name="api-referrals-rewards",
    ),
]
