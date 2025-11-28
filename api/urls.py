from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

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

urlpatterns = [
    path("", include(router.urls)),
    path("wallet/", views.WalletView.as_view(), name="api-wallet"),
    path("support/", views.SupportRequestView.as_view(), name="api-support"),
    path("public/certificate/", views.PublicCertificateView.as_view(), name="api-public-certificate"),
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
    path("auth/verification/send/", views.send_verification_code, name="send_verification_code"),
    path("auth/verification/verify/", views.verify_email_code, name="verify_email_code"),
]
