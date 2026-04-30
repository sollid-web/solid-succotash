# 1. Base Image
FROM python:3.11-slim

# 2. Environment Variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
# Default concurrency for Gunicorn
ENV WEB_CONCURRENCY=2 

WORKDIR /app

# 3. System Dependencies
# libpq-dev is required for PostgreSQL/Supabase
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 4. Python Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy Project Files
COPY . .

# 6. Build Stage: Collect Static Files
# We provide dummy variables here so Django doesn't crash 
# because it can't find your Supabase credentials during build time.
RUN DATABASE_URL=postgres://none:none@none:5432/none \
    SECRET_KEY=build_stage_dummy_key \
    python manage.py collectstatic --noinput

# 7. Runtime Stage: The Start Command
# - We run migrations first so your Supabase tables stay updated.
# - We bind Gunicorn to the $PORT variable provided by Railway.
# - We increase the timeout to 120s to account for initial DB connections.
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:${PORT} --timeout 120"]

