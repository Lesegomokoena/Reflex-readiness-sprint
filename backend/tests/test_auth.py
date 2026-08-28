import pytest
from app import create_app
from app.extensions import db
from app.models import User

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def test_user(app):
    user = User(name="Test User", email="test@demo.com", role="retailer_staff")
    user.set_password("password")
    db.session.add(user)
    db.session.commit()
    return user

def test_login_success(client, test_user):
    res = client.post("/api/auth/login", json={"email": "test@demo.com", "password": "password"})
    assert res.status_code == 200
    data = res.get_json()["data"]
    assert "access_token" in data
    assert data["role"] == "retailer_staff"

def test_login_fail(client, test_user):
    res = client.post("/api/auth/login", json={"email": "test@demo.com", "password": "wrong"})
    assert res.status_code == 401
