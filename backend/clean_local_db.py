from app import create_app
from app.extensions import db
from app.models import User, DeliveryRequest, DeliveryEvent, ProofOfDelivery
import os

app = create_app()
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.abspath('instance/app.db')}"

with app.app_context():
    print("Users in local DB:")
    users = User.query.all()
    for u in users:
        print(f"ID: {u.id}, Name: {u.name}, Role: {u.role}")

    print("Cleaning up...")
    andrews = User.query.filter(User.name.ilike('andrew'), User.role == 'rider').all()
    small_andrew = None
    capital_andrews = []
    
    for a in andrews:
        if a.name.startswith('a'):
            small_andrew = a
        else:
            capital_andrews.append(a)
            
    if not small_andrew:
        print("Creating small andrew")
        small_andrew = User(name="andrew", email="andrew@test.com", role="rider")
        small_andrew.set_password("password")
        db.session.add(small_andrew)
        db.session.commit()

    for cap_a in capital_andrews:
        # Reassign deliveries
        deliveries = DeliveryRequest.query.filter_by(assigned_rider_id=cap_a.id).all()
        for d in deliveries:
            d.assigned_rider_id = small_andrew.id
            
        deliveries_created = DeliveryRequest.query.filter_by(created_by_id=cap_a.id).all()
        for d in deliveries_created:
            d.created_by_id = small_andrew.id

        events = DeliveryEvent.query.filter_by(actor_id=cap_a.id).all()
        for e in events:
            e.actor_id = small_andrew.id
            
        proofs = ProofOfDelivery.query.filter_by(scanned_by_id=cap_a.id).all()
        for p in proofs:
            p.scanned_by_id = small_andrew.id
        
        db.session.delete(cap_a)

    kens = User.query.filter(User.name.ilike('ken'), User.role == 'rider').all()
    for k in kens:
        deliveries = DeliveryRequest.query.filter_by(assigned_rider_id=k.id).all()
        for d in deliveries:
            d.assigned_rider_id = small_andrew.id
            
        deliveries_created = DeliveryRequest.query.filter_by(created_by_id=k.id).all()
        for d in deliveries_created:
            d.created_by_id = small_andrew.id

        events = DeliveryEvent.query.filter_by(actor_id=k.id).all()
        for e in events:
            e.actor_id = small_andrew.id
            
        proofs = ProofOfDelivery.query.filter_by(scanned_by_id=k.id).all()
        for p in proofs:
            p.scanned_by_id = small_andrew.id
        
        db.session.delete(k)

    db.session.commit()
    print("Cleanup complete.")
