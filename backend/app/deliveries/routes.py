from flask import Blueprint, request, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models import DeliveryRequest, DeliveryEvent, User, ProofOfDelivery
from app.extensions import db
from app.utils.responses import success_response, error_response
from app.auth.decorators import role_required
from app.deliveries.transitions import is_valid_transition
from app.utils.qrcode import generate_qr_code_bytes
from datetime import datetime
import io

deliveries_bp = Blueprint('deliveries', __name__)

def log_event(delivery_request_id, status, actor_id, note=None):
    event = DeliveryEvent(
        delivery_request_id=delivery_request_id,
        status=status,
        actor_id=actor_id,
        note=note
    )
    db.session.add(event)
    return event

@deliveries_bp.route('', methods=['POST'])
@jwt_required()
@role_required('retailer_staff')
def create_delivery():
    data = request.get_json() or {}
    required_fields = ['customer_name', 'customer_phone', 'delivery_address', 'item_description']
    
    for field in required_fields:
        if not data.get(field):
            return error_response('BAD_REQUEST', f'Missing required field: {field}', 400)
    
    current_user_id = get_jwt_identity()
    
    delivery = DeliveryRequest(
        created_by_id=current_user_id,
        customer_name=data['customer_name'],
        customer_phone=data['customer_phone'],
        delivery_address=data['delivery_address'],
        item_description=data['item_description'],
        status='PENDING'
    )
    db.session.add(delivery)
    db.session.commit()
    
    # Log initial event
    log_event(delivery.id, 'PENDING', current_user_id)
    db.session.commit()
    
    return success_response(delivery.to_dict(), 201)

@deliveries_bp.route('', methods=['GET'])
@jwt_required()
def list_deliveries():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    status_filter = request.args.get('status')
    since_filter = request.args.get('since')
    
    query = DeliveryRequest.query
    
    if role == 'retailer_staff':
        query = query.filter_by(created_by_id=current_user_id)
    elif role == 'rider':
        query = query.filter_by(assigned_rider_id=current_user_id)
    elif role == 'dispatcher':
        # dispatcher sees all
        pass
    else:
        return error_response('FORBIDDEN', 'Role not recognized', 403)
        
    if status_filter:
        query = query.filter_by(status=status_filter)
        
    if since_filter:
        try:
            since_dt = datetime.fromisoformat(since_filter.replace('Z', '+00:00'))
            query = query.filter(DeliveryRequest.updated_at > since_dt)
        except ValueError:
            return error_response('BAD_REQUEST', 'Invalid since parameter format, must be ISO8601', 400)
            
    deliveries = query.all()
    return success_response([d.to_dict() for d in deliveries])

@deliveries_bp.route('/<string:id>', methods=['GET'])
@jwt_required()
def get_delivery(id):
    delivery = DeliveryRequest.query.get(id)
    if not delivery:
        return error_response('NOT_FOUND', 'Delivery request not found', 404)
        
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    if role == 'retailer_staff' and delivery.created_by_id != current_user_id:
        return error_response('FORBIDDEN', 'Cannot access this delivery request', 403)
    if role == 'rider' and delivery.assigned_rider_id != current_user_id:
        return error_response('FORBIDDEN', 'Cannot access this delivery request', 403)
        
    return success_response(delivery.to_dict(include_events=True))

@deliveries_bp.route('/<string:id>/qrcode', methods=['GET'])
@jwt_required()
def get_qrcode(id):
    delivery = DeliveryRequest.query.get(id)
    if not delivery:
        return error_response('NOT_FOUND', 'Delivery request not found', 404)
        
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    if role == 'retailer_staff' and delivery.created_by_id != current_user_id:
        return error_response('FORBIDDEN', 'Cannot access this delivery request', 403)
    if role == 'rider' and delivery.assigned_rider_id != current_user_id:
        return error_response('FORBIDDEN', 'Cannot access this delivery request', 403)
        
    qr_bytes = generate_qr_code_bytes(delivery.qr_token)
    return send_file(io.BytesIO(qr_bytes), mimetype='image/png')

@deliveries_bp.route('/<string:id>/assign', methods=['PATCH'])
@jwt_required()
@role_required('dispatcher')
def assign_rider(id):
    delivery = DeliveryRequest.query.get(id)
    if not delivery:
        return error_response('NOT_FOUND', 'Delivery request not found', 404)
        
    data = request.get_json() or {}
    rider_id = data.get('rider_id')
    
    if not rider_id:
        return error_response('BAD_REQUEST', 'rider_id is required', 400)
        
    rider = User.query.get(rider_id)
    if not rider or rider.role != 'rider':
        return error_response('BAD_REQUEST', 'Invalid rider_id', 400)
        
    if delivery.status == 'ASSIGNED' and delivery.assigned_rider_id == rider_id:
        return success_response(delivery.to_dict())
        
    if delivery.status != 'PENDING':
        return error_response('CONFLICT', 'Can only assign from PENDING status', 409)
        
    delivery.assigned_rider_id = rider_id
    delivery.status = 'ASSIGNED'
    log_event(delivery.id, 'ASSIGNED', get_jwt_identity(), note=f'Assigned to rider {rider.name}')
    db.session.commit()
    
    return success_response(delivery.to_dict())

@deliveries_bp.route('/<string:id>/status', methods=['PATCH'])
@jwt_required()
@role_required('rider', 'dispatcher')
def update_status(id):
    delivery = DeliveryRequest.query.get(id)
    if not delivery:
        return error_response('NOT_FOUND', 'Delivery request not found', 404)
        
    data = request.get_json() or {}
    new_status = data.get('status')
    note = data.get('note')
    
    if not new_status:
        return error_response('BAD_REQUEST', 'status is required', 400)
        
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    if role == 'rider' and delivery.assigned_rider_id != current_user_id:
        return error_response('FORBIDDEN', 'Cannot update a delivery not assigned to you', 403)
        
    if delivery.status == new_status:
        return success_response(delivery.to_dict())
        
    if not is_valid_transition(delivery.status, new_status):
        return error_response('CONFLICT', f'Invalid transition from {delivery.status} to {new_status}', 409)
        
    if role == 'rider' and new_status == 'CANCELLED':
        return error_response('FORBIDDEN', 'Riders cannot cancel deliveries this way', 403)
        
    delivery.status = new_status
    log_event(delivery.id, new_status, current_user_id, note)
    db.session.commit()
    
    return success_response(delivery.to_dict())

@deliveries_bp.route('/<string:id>/scan', methods=['POST'])
@jwt_required()
@role_required('rider')
def scan_qr(id):
    delivery = DeliveryRequest.query.get(id)
    if not delivery:
        return error_response('NOT_FOUND', 'Delivery request not found', 404)
        
    current_user_id = get_jwt_identity()
    if delivery.assigned_rider_id != current_user_id:
        return error_response('FORBIDDEN', 'Cannot scan for a delivery not assigned to you', 403)
        
    data = request.get_json() or {}
    token = data.get('token')
    scan_type = data.get('scan_type')
    
    if not token or not scan_type:
        return error_response('BAD_REQUEST', 'token and scan_type are required', 400)
        
    if scan_type not in ['pickup', 'dropoff']:
        return error_response('BAD_REQUEST', 'scan_type must be pickup or dropoff', 400)
        
    if token != delivery.qr_token:
        return error_response('CONFLICT', 'Invalid QR token', 409)
        
    if scan_type == 'pickup' and delivery.status != 'ASSIGNED':
        return error_response('CONFLICT', 'Can only pickup from ASSIGNED status', 409)
        
    if scan_type == 'dropoff' and delivery.status != 'PICKED_UP':
        return error_response('CONFLICT', 'Can only dropoff from PICKED_UP status', 409)
        
    new_status = 'PICKED_UP' if scan_type == 'pickup' else 'DELIVERED'
    
    proof = ProofOfDelivery(
        delivery_request_id=delivery.id,
        scan_type=scan_type,
        scanned_by_id=current_user_id,
        token_used=token
    )
    db.session.add(proof)
    
    delivery.status = new_status
    log_event(delivery.id, new_status, current_user_id, note=f'{scan_type} scan successful')
    db.session.commit()
    
    return success_response(delivery.to_dict(include_events=True))
