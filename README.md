# Reflex-readiness-sprint
Reflex — Delivery management system for small Kenyan retailers

## Frontend
The frontend files (HTML/CSS/JS) are located in the `frontend` folder. They can be served statically using any simple HTTP server (e.g. `python -m http.server 8080` from the project root).

## Backend

This is the Flask backend for Reflex — a delivery coordination API.

### Setup

1. Navigate to the backend directory and create a virtual environment:
   cd backend
   python -m venv venv
   source venv/bin/activate
   

2. Install dependencies:
   
   pip install -r requirements.txt
   

3. Setup environment variables:
   
    .env
   
   

4. Run migrations:
   
   export FLASK_APP="app:create_app()"
   flask db init
   flask db migrate -m "initial migration"
   flask db upgrade


5. Run seed data:
   
   python seed.py


6. Run the server:
   
   flask run --port=5000
   

### API Examples

**Login**

curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"retailer@demo.com","password":"password"}'

**Get Deliveries**

curl http://localhost:5000/api/deliveries \
     -H "Authorization: Bearer <token>"

**Assign Rider (Dispatcher)**
curl -X PATCH http://localhost:5000/api/deliveries/<id>/assign \
     -H "Authorization: Bearer <dispatcher_token>" \
     -H "Content-Type: application/json" \
     -d '{"rider_id":"<rider_id>"}'


**Scan Delivery (Rider)**

curl -X POST http://localhost:5000/api/deliveries/<id>/scan \
     -H "Authorization: Bearer <rider_token>" \
     -H "Content-Type: application/json" \
     -d '{"token":"<qr_token>","scan_type":"pickup"}'

