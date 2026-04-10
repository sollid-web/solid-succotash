#!/bin/bash
# Start Django backend server on port 8000

echo "🚀 Starting Django backend server..."
echo "API available at: http://localhost:8000/api/"
echo ""

cd /home/code/solid-succotash

# Run Django dev server
.venv/bin/python manage.py runserver 0.0.0.0:8000
