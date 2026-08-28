import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = False  # Tokens do not expire automatically
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "*")
    SECRET_KEY = os.getenv("SECRET_KEY", "flask-secret-key")
