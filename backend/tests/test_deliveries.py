import pytest
from app import create_app
from app.extensions import db
from app.models import User, DeliveryRequest

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
def users(app):
    retailer = User(name='R', email='r@demo.com', role='retailer_staff')
    retailer.set_password('pw')
    dispatcher = User(name='D', email='d@demo.com', role='dispatcher')
    dispatcher.set_password('pw')
    rider = User(name='Ri', email='ri@demo.com', role='rider')
    rider.set_password('pw')
    
    db.session.add_all([retailer, dispatcher, rider])
    db.session.commit()
    return {'retailer': retailer, 'dispatcher': dispatcher, 'rider': rider}

def login(client, email):
    res = client.post("/api/auth/login", json={"email": email, "password": "pw"})
    return res.get_json()["data"]["access_token"]

def test_full_delivery_flow(client, users):
    r_token = login(client, 'r@demo.com')
    d_token = login(client, 'd@demo.com')
    ri_token = login(client, 'ri@demo.com')

    # 1. Retailer creates request
    res = client.post("/api/deliveries", json={
        "customer_name": "Cust",
        "customer_phone": "123",
        "delivery_address": "Addr",
        "item_description": "Desc"
    }, headers={"Authorization": f"Bearer {r_token}"})
    assert res.status_code == 201
    delivery = res.get_json()["data"]
    d_id = delivery["id"]
    qr_token = delivery["qr_token"]
    assert delivery["status"] == "PENDING"

    # 2. Dispatcher assigns rider
    res = client.patch(f"/api/deliveries/{d_id}/assign", json={
        "rider_id": users['rider'].id
    }, headers={"Authorization": f"Bearer {d_token}"})
    assert res.status_code == 200
    assert res.get_json()["data"]["status"] == "ASSIGNED"

    # Dispatcher assigns again (idempotent)
    res = client.patch(f"/api/deliveries/{d_id}/assign", json={
        "rider_id": users['rider'].id
    }, headers={"Authorization": f"Bearer {d_token}"})
    assert res.status_code == 200

    # 3. Rider scans pickup
    res = client.post(f"/api/deliveries/{d_id}/scan", json={
        "token": qr_token,
        "scan_type": "pickup"
    }, headers={"Authorization": f"Bearer {ri_token}"})
    assert res.status_code == 200
    assert res.get_json()["data"]["status"] == "PICKED_UP"

    # 4. Rider scans dropoff
    res = client.post(f"/api/deliveries/{d_id}/scan", json={
        "token": qr_token,
        "scan_type": "dropoff"
    }, headers={"Authorization": f"Bearer {ri_token}"})
    assert res.status_code == 200
    assert res.get_json()["data"]["status"] == "DELIVERED"

def test_invalid_transitions(client, users):
    r_token = login(client, 'r@demo.com')
    d_token = login(client, 'd@demo.com')
    ri_token = login(client, 'ri@demo.com')

    # Create
    res = client.post("/api/deliveries", json={
        "customer_name": "Cust",
        "customer_phone": "123",
        "delivery_address": "Addr",
        "item_description": "Desc"
    }, headers={"Authorization": f"Bearer {r_token}"})
    d_id = res.get_json()["data"]["id"]
    qr_token = res.get_json()["data"]["qr_token"]

    # Assign
    client.patch(f"/api/deliveries/{d_id}/assign", json={"rider_id": users['rider'].id}, headers={"Authorization": f"Bearer {d_token}"})

    # Try dropoff before pickup
    res = client.post(f"/api/deliveries/{d_id}/scan", json={"token": qr_token, "scan_type": "dropoff"}, headers={"Authorization": f"Bearer {ri_token}"})
    assert res.status_code == 409
