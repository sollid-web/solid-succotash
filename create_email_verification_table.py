"""Create EmailVerification table manually"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    # Drop table if exists
    cursor.execute("DROP TABLE IF EXISTS users_emailverification")
    
    # Create table
    cursor.execute("""
        CREATE TABLE users_emailverification (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token VARCHAR(64) UNIQUE NOT NULL,
            expires_at DATETIME NOT NULL,
            used_at DATETIME NULL,
            created_at DATETIME NOT NULL,
            user_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE
        )
    """)
    
    # Create indexes
    cursor.execute("""
        CREATE INDEX users_email_user_id_86b0fe_idx 
        ON users_emailverification(user_id, expires_at)
    """)
    
    cursor.execute("""
        CREATE INDEX users_email_token_c80ef6_idx 
        ON users_emailverification(token)
    """)
    
    print("✓ EmailVerification table created successfully!")

print("✓ Done!")
