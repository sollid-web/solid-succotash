# WolvCapital - Full Stack Application

Professional investment platform with Django backend and Next.js frontend.

## Project Structure

```
wolvcapital/
├── frontend/              # Next.js frontend (port 3000)
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   └── components/   # React components
│   └── public/           # Static assets
│
├── wolvcapital/          # Django project settings
├── core/                 # Core Django app (views, forms)
├── users/                # User management (auth, wallet)
├── investments/          # Investment plans & user investments
├── transactions/         # Deposits, withdrawals, audit logs
├── api/                  # REST API (DRF)
├── templates/            # Django templates
├── static/               # Django static files
└── manage.py             # Django management
```

## Tech Stack

### Backend (Django)
- **Framework**: Django 5.0.7
- **Database**: PostgreSQL (production) / SQLite (dev)
- **Authentication**: django-allauth (email-only)
- **API**: Django REST Framework
- **Serving**: Gunicorn + WhiteNoise

### Frontend (Next.js)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: React 18

## Quick Start

### Backend (Django)

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed investment plans
python manage.py seed_plans

# Create superuser
python manage.py createsuperuser

# Run development server (port 8000)
python manage.py runserver
```

### Frontend (Next.js)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Or build for production
npm run build
npm start
```

## Development Workflow

1. **Backend** runs on `http://localhost:8000`
   - Django admin: `http://localhost:8000/admin/`
   - API endpoints: `http://localhost:8000/api/`

2. **Frontend** runs on `http://localhost:3000`
   - Homepage with flip card and legal links
   - Independent React application

3. **Separate but Connected**
   - Frontend can call Django API endpoints
   - Django serves its own templates independently
   - No file conflicts between systems

## Environment Variables

### Django (.env)
```bash
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:pass@localhost/dbname
ALLOWED_HOSTS=localhost,127.0.0.1
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Next.js (frontend/.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deployment

### Django (Render/Heroku)
```bash
# Collect static files
python manage.py collectstatic --noinput

# Run with Gunicorn
gunicorn wolvcapital.wsgi:application
```

### Next.js (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy .next folder
```

## Key Features

- ✅ **Separated Concerns**: Django and Next.js in different directories
- ✅ **No Conflicts**: Separate package.json, configs, dependencies
- ✅ **Flip Visa Card**: Interactive 3D card component
- ✅ **Legal Links**: Terms, Privacy, Risk, Disclaimer pages
- ✅ **Brand Consistency**: Shared color scheme across stack
- ✅ **Type Safety**: TypeScript in frontend, Python typing in backend
- ✅ **API Ready**: DRF endpoints for frontend consumption

## Architecture Benefits

1. **Independent Development**: Work on frontend/backend separately
2. **Clean Separation**: No syntax or config conflicts
3. **Modern Stack**: Latest Django + Next.js best practices
4. **Scalable**: Deploy frontend and backend independently
5. **Flexible**: Use Django templates OR Next.js pages

## Commands Reference

### Django
```bash
python manage.py runserver          # Start dev server
python manage.py migrate            # Run migrations
python manage.py seed_plans         # Seed investment plans
python manage.py promote_admin <email>  # Promote user to admin
python manage.py test              # Run tests
```

### Frontend
```bash
cd frontend
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint check
npm run type-check # TypeScript validation
```

## Testing

### Backend
```bash
python manage.py test
```

### Frontend
```bash
cd frontend
npm test  # (when tests are added)
```

## Documentation

- Django: See `.github/copilot-instructions.md`
- Frontend: See `frontend/README.md`
- API: See `api/README.md` (to be created)

---

**Built with separation in mind** - Frontend and backend are completely independent and can be deployed separately or together.
