from datetime import datetime
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False) # 'retailer_staff', 'dispatcher', 'rider'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None
        }

class DeliveryRequest(db.Model):
    __tablename__ = 'delivery_requests'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_by_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    delivery_address = db.Column(db.String(255), nullable=False)
    item_description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='PENDING')
    assigned_rider_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    qr_token = db.Column(db.String(100), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    created_by = db.relationship('User', foreign_keys=[created_by_id])
    assigned_rider = db.relationship('User', foreign_keys=[assigned_rider_id])
    events = db.relationship('DeliveryEvent', backref='delivery_request', lazy=True, order_by='DeliveryEvent.created_at')
    proofs = db.relationship('ProofOfDelivery', backref='delivery_request', lazy=True)

    def to_dict(self, include_events=False):
        data = {
            'id': self.id,
            'created_by_id': self.created_by_id,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'delivery_address': self.delivery_address,
            'item_description': self.item_description,
            'status': self.status,
            'assigned_rider_id': self.assigned_rider_id,
            'qr_token': self.qr_token,
            'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None,
            'updated_at': self.updated_at.isoformat() + 'Z' if self.updated_at else None
        }
        if include_events:
            data['events'] = [e.to_dict() for e in self.events]
            data['proofs'] = [p.to_dict() for p in self.proofs]
        return data

class DeliveryEvent(db.Model):
    __tablename__ = 'delivery_events'
    id = db.Column(db.Integer, primary_key=True)
    delivery_request_id = db.Column(db.String(36), db.ForeignKey('delivery_requests.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    actor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    note = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'delivery_request_id': self.delivery_request_id,
            'status': self.status,
            'actor_id': self.actor_id,
            'note': self.note,
            'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None
        }

class ProofOfDelivery(db.Model):
    __tablename__ = 'proof_of_deliveries'
    id = db.Column(db.Integer, primary_key=True)
    delivery_request_id = db.Column(db.String(36), db.ForeignKey('delivery_requests.id'), nullable=False)
    scan_type = db.Column(db.String(20), nullable=False) # 'pickup', 'dropoff'
    scanned_by_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    scanned_at = db.Column(db.DateTime, default=datetime.utcnow)
    token_used = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'delivery_request_id': self.delivery_request_id,
            'scan_type': self.scan_type,
            'scanned_by_id': self.scanned_by_id,
            'scanned_at': self.scanned_at.isoformat() + 'Z' if self.scanned_at else None,
            'token_used': self.token_used
        }
