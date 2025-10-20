#!/bin/bash

# WolvCapital Render.com Startup Script
echo "🚀 Starting WolvCapital on Render.com..."

# Don't exit on errors during setup - we want to try to start the server even if setup fails
set +e

# Wait for database to be ready
echo "🔄 Waiting for database connection..."
python << END
import sys
import time
import psycopg2
from urllib.parse import urlparse
import os

url = urlparse(os.environ['DATABASE_URL'])
dbname = url.path[1:]
user = url.username
password = url.password
host = url.hostname
port = url.port

for i in range(10):
    try:
        psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
        print("✅ Database is ready!")
        sys.exit(0)
    except psycopg2.OperationalError as e:
        print(f"⏳ Database not ready, waiting... (Attempt {i+1}/10)")
        time.sleep(5)

print("❌ Could not connect to database")
sys.exit(1)
END

# Apply database migrations with retry
echo "📦 Running migrations..."
for i in {1..3}; do
    if python manage.py migrate --noinput; then
        echo "✅ Migrations completed successfully"
        break
    else
        echo "⚠️ Migration attempt $i failed, retrying..."
        sleep 5
    fi
done

# Start Gunicorn
echo "🌟 Starting Gunicorn..."
gunicorn wolvcapital.wsgi:application
