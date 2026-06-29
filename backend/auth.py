import sqlite3
import bcrypt
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "users.db")

def init_db():
    """Initialize the users database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
    print("✅ Database initialized")

def create_user(full_name, email, password):
    """Create a new user"""
    print(f"📝 Creating user: {full_name}, {email}")  # ← ADD THIS LINE
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Hash the password
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    try:
        cursor.execute(
            "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
            (full_name, email, password_hash)
        )
        conn.commit()
        conn.close()
        return {"success": True, "message": "User created successfully"}
    except sqlite3.IntegrityError as e:
        print(f"❌ IntegrityError: {e}")  # ← ADD THIS LINE
        conn.close()
        return {"success": False, "message": "Email already exists"}

def verify_user(email, password):
    """Verify user credentials"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, full_name, email, password_hash FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        user_id, full_name, user_email, password_hash = user
        if bcrypt.checkpw(password.encode('utf-8'), password_hash):
            return {"success": True, "user": {"id": user_id, "name": full_name, "email": user_email}}
    
    return {"success": False, "message": "Invalid email or password"}

def get_user_by_email(email):
    """Get user by email"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, full_name, email FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return {"id": user[0], "name": user[1], "email": user[2]}
    return None

# Initialize database on import
init_db()
