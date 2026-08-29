from app import create_app
from app.extensions import db
from app.models import User, DeliveryRequest

app = create_app()

with app.app_context():
    print("Unassigning riders from all deliveries...")
    deliveries = DeliveryRequest.query.all()
    for d in deliveries:
        d.assigned_rider_id = None
        d.status = 'PENDING'
    
    print("Deleting all riders...")
    User.query.filter_by(role='rider').delete()
    
    db.session.commit()
    print("All riders have been removed successfully.")
