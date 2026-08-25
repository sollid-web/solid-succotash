# Admin dashboard integration

The production admin console is available at `https://www.wolvcapital.com/admin` once the updated frontend deployment is published. It reuses the existing frontend API helper and connects to the live Django REST API at `https://api.wolvcapital.com`.

## Authentication

The login form posts `{ email, password }` to `/api/auth/jwt/create/`, matching the custom Django Simple JWT serializer. The returned access and refresh tokens are stored in browser local storage. API requests send `Authorization: Bearer <access-token>`. When an API request returns `401`, the client attempts `/api/auth/jwt/refresh/` once and retries the original request. The current user is loaded from `/api/auth/me/`, and access is allowed only when `is_staff` or `is_superuser` is true.

## Resources

The dashboard maps the following admin routes from the existing DRF router:

| Resource | Endpoint | Supported UI |
| --- | --- | --- |
| Campaign announcements | `/api/admin/campaigns/` | Create, list, show, edit, delete |
| Investment plans | `/api/admin/plans/` | Create, list, show, edit, delete |
| Transactions | `/api/admin/transactions/` | List, show, approve/reject with notes |
| User investments | `/api/admin/investments/` | List, show, approve/reject with notes |
| KYC applications | `/api/admin/kyc/` | List, show, approve/reject with notes and rejection reason |
| KYC documents | `/api/admin/kyc-documents/` | List, show, approve/reject with approval notes |

The review actions intentionally use the payloads expected by the existing viewsets rather than pretending read-only serializer fields are generic CRUD fields.

## Pagination

The client accepts standard DRF result envelopes with `count`, `next`, `previous`, and `results`, and also supports unpaginated arrays. The current backend settings do not define a global DRF pagination class, so the dashboard does not assume a page size or require pagination metadata. If pagination is enabled per-view or globally later, the same client will use the returned `next` and `previous` links.

## Environment

For the live deployment, set the frontend hosting environment variables to:

```dotenv
NEXT_PUBLIC_API_URL=https://api.wolvcapital.com
NEXT_PUBLIC_SITE_URL=https://www.wolvcapital.com
```

For local development, use `http://localhost:8000` and `http://localhost:3000` instead. The client also has a production fallback to `https://api.wolvcapital.com`, but setting the hosting variable explicitly is recommended.

Run `npm run type-check`, `npm run lint`, and `npm run build` before deployment. The existing repository has one unrelated lint warning in `src/components/SupportChat.tsx`; the new admin dashboard introduces no lint errors.
