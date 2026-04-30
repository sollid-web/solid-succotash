FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Set a default value so the CMD expansion always has an integer
ENV WEB_CONCURRENCY=2 
ENV PORT=8000

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Use the environment variable directly; the shell will now expand it to '2' (or your override)
CMD ["sh", "-c", "python manage.py collectstatic --noinput && echo \"STATIC DONE\" && python manage.py migrate --verbosity 3 2>&1 && echo \"MIGRATE DONE\" && gunicorn wolvcapital.wsgi:application --bind \"0.0.0.0:${PORT:-8000}\" --timeout 120"]
