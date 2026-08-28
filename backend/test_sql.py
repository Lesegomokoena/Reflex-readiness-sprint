from app import create_app
from app.models import DeliveryRequest

app = create_app()
with app.app_context():
    d = DeliveryRequest.query.first()
    if d:
        print("Delivery ID:", d.id)
        d2 = DeliveryRequest.query.get(d.id)
        print("Found with get:", d2 is not None)
    else:
        print("No deliveries in DB")
