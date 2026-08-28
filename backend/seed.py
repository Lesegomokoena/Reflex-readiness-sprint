from app import create_app
from app.extensions import db
from app.models import User, DeliveryRequest
import uuid

app = create_app()

def seed_data():
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()

        print("Creating users...")
        retailer = User(name='Alice Retailer', email='retailer@demo.com', role='retailer_staff', phone='123456789')
        retailer.set_password('password')

        dispatcher = User(name='Bob Dispatcher', email='dispatcher@demo.com', role='dispatcher', phone='987654321')
        dispatcher.set_password('password')

        rider1 = User(name='Charlie Rider', email='rider1@demo.com', role='rider', phone='555555555')
        rider1.set_password('password')

        rider2 = User(name='Dave Rider', email='rider2@demo.com', role='rider', phone='666666666')
        rider2.set_password('password')

        db.session.add_all([retailer, dispatcher, rider1, rider2])
        db.session.commit()

        print("Creating deliveries...")
        d1 = DeliveryRequest(
            created_by_id=retailer.id,
            customer_name='John Doe',
            customer_phone='111222333',
            delivery_address='123 Main St',
            item_description='Package of books',
            status='PENDING'
        )
        
        d2 = DeliveryRequest(
            created_by_id=retailer.id,
            customer_name='Jane Smith',
            customer_phone='444555666',
            delivery_address='456 Market St',
            item_description='Electronics',
            status='ASSIGNED',
            assigned_rider_id=rider1.id
        )

        d3 = DeliveryRequest(
            created_by_id=retailer.id,
            customer_name='Tom Brown',
            customer_phone='777888999',
            delivery_address='789 River Ave',
            item_description='Groceries',
            status='PICKED_UP',
            assigned_rider_id=rider2.id
        )

        db.session.add_all([d1, d2, d3])
        db.session.commit()
        print("Seed data created successfully.")

if __name__ == '__main__':
    seed_data()
