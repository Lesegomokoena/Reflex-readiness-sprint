import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    db_url = os.getenv("DATABASE_URL", "sqlite:///app.db")
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = False  # Tokens do not expire automatically
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "*")
    SECRET_KEY = os.getenv("SECRET_KEY", "flask-secret-key")
