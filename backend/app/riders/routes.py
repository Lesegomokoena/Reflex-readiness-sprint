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
