from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import User
from app.extensions import db
from app.utils.responses import success_response, error_response
from app.auth.decorators import role_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return error_response('BAD_REQUEST', 'Email and password are required', 400)

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return error_response('UNAUTHORIZED', 'Invalid email or password', 401)

    additional_claims = {'role': user.role, 'name': user.name}
    access_token = create_access_token(identity=user.id, additional_claims=additional_claims)

    return success_response({
        'access_token': access_token,
        'role': user.role,
        'name': user.name
    })

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'retailer_staff')

    if not email or not password or not name:
        return error_response('BAD_REQUEST', 'Email, password, and name are required', 400)

    if role not in ['retailer_staff', 'dispatcher', 'rider']:
        return error_response('BAD_REQUEST', 'Invalid role', 400)

    if User.query.filter_by(email=email).first():
        return error_response('CONFLICT', 'Email already registered', 409)

    user = User(email=email, name=name, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    additional_claims = {'role': user.role, 'name': user.name}
    access_token = create_access_token(identity=user.id, additional_claims=additional_claims)

    return success_response({
        'access_token': access_token,
        'role': user.role,
        'name': user.name
    }, 201)

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return error_response('NOT_FOUND', 'User not found', 404)
    return success_response(user.to_dict())
