# 1. Base Image
FROM python:3.11-slim

# 2. Environment Variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Default port if Railway doesn't provide one
ENV PORT=8000

WORKDIR /app

# 3. System Dependencies
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
# We use dummy values so Django doesn't crash looking for a DB during build
RUN DATABASE_URL=postgres://none:none@none:5432/none \
    SECRET_KEY=build_stage_dummy_key \
    python manage.py collectstatic --noinput

# 7. Runtime Stage: The Start Command
# Using 'sh -c' is the secret sauce. It tells Docker to run a shell first, 
# which then turns $PORT into the actual number Railway assigned.
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:$PORT --timeout 120"]

