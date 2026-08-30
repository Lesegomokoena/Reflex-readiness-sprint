from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.models import User
from app.utils.responses import success_response, error_response
from app.auth.decorators import role_required

riders_bp = Blueprint('riders', __name__)

@riders_bp.route('', methods=['GET'])
@jwt_required()
@role_required('dispatcher')
def list_riders():
    riders = User.query.filter_by(role='rider').all()
    return success_response([r.to_dict() for r in riders])

@riders_bp.route('/cleanup_andrews', methods=['GET'])
def cleanup_andrews():
    from app.extensions import db
    from app.models import DeliveryRequest, DeliveryEvent, ProofOfDelivery
    import sys
    
    try:
        # Find all riders named andrew or ken
        andrews = User.query.filter(User.name.ilike('andrew'), User.role == 'rider').all()
        kens = User.query.filter(User.name.ilike('ken'), User.role == 'rider').all()
        
        small_andrew = None
        capital_andrews = []
        
        for a in andrews:
            if a.name.startswith('a'):
                small_andrew = a
            else:
                capital_andrews.append(a)
                
        if not small_andrew:
            small_andrew = User(name="andrew", email="andrew_small@demo.com", role="rider")
            small_andrew.set_password("password")
            db.session.add(small_andrew)
            db.session.commit()
            
        users_to_delete = capital_andrews + kens
        
        for u in users_to_delete:
            deliveries_assigned = DeliveryRequest.query.filter_by(assigned_rider_id=u.id).all()
            for d in deliveries_assigned:
                d.assigned_rider_id = small_andrew.id

            deliveries_created = DeliveryRequest.query.filter_by(created_by_id=u.id).all()
            for d in deliveries_created:
                d.created_by_id = small_andrew.id
                
            events = DeliveryEvent.query.filter_by(actor_id=u.id).all()
            for e in events:
                e.actor_id = small_andrew.id
                
            proofs = ProofOfDelivery.query.filter_by(scanned_by_id=u.id).all()
            for p in proofs:
                p.scanned_by_id = small_andrew.id
            
            db.session.delete(u)
            
        db.session.commit()
        return success_response({"message": f"Successfully removed {len(users_to_delete)} duplicate riders."})
    except Exception as e:
        db.session.rollback()
        return error_response('CLEANUP_ERROR', str(e), 500)
