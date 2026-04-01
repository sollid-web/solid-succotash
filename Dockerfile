FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app


RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Default concurrency if Railway/Vercel doesn't set it

# Use shell form so environment variables EXPAND correctly
# final part of Dockerfile
# Run migrations, collectstatic, then start Gunicorn
CMD ["gunicorn", "wolvcapital.wsgi:application", "--bind", "0.0.0.0:$PORT", "--workers", "3", "--threads", "2", "--timeout", "120"]
