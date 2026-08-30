from app import create_app
from app.extensions import db
from app.models import User, DeliveryRequest

app = create_app()

with app.app_context():
    print("Finding all riders named 'Andrew' (case-insensitive)...")
    andrews = User.query.filter(User.name.ilike('andrew'), User.role == 'rider').all()
    
    small_andrew = None
    capital_andrews = []
    
    for a in andrews:
        if a.name.startswith('a'):
            small_andrew = a
        else:
            capital_andrews.append(a)
            
    if not capital_andrews:
        print("No capital Andrews found.")
    else:
        if small_andrew:
            print(f"Found small andrew (ID: {small_andrew.id}).")
        else:
            print("No small andrew found! Creating one to reassign deliveries...")
            small_andrew = User(name="andrew", email="andrew@example.com", role="rider")
            small_andrew.set_password("password")
            db.session.add(small_andrew)
            db.session.commit()
            
        print(f"Found {len(capital_andrews)} capital Andrews. Reassigning deliveries and removing them...")
        
        for cap_a in capital_andrews:
            # Reassign deliveries assigned to the rider
            deliveries_assigned = DeliveryRequest.query.filter_by(assigned_rider_id=cap_a.id).all()
            for d in deliveries_assigned:
                d.assigned_rider_id = small_andrew.id

            # Reassign deliveries created by the rider (just in case)
            deliveries_created = DeliveryRequest.query.filter_by(created_by_id=cap_a.id).all()
            for d in deliveries_created:
                d.created_by_id = small_andrew.id
                
            # Reassign delivery events
            from app.models import DeliveryEvent, ProofOfDelivery
            events = DeliveryEvent.query.filter_by(actor_id=cap_a.id).all()
            for e in events:
                e.actor_id = small_andrew.id
                
            # Reassign proofs of delivery
            proofs = ProofOfDelivery.query.filter_by(scanned_by_id=cap_a.id).all()
            for p in proofs:
                p.scanned_by_id = small_andrew.id
            
            # Delete the capital Andrew
            db.session.delete(cap_a)
            
        db.session.commit()
        print("Successfully removed capital Andrews and reassigned deliveries to 'andrew'.")
