from functools import wraps
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from app.utils.responses import error_response

def role_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception as e:
                return error_response('UNAUTHORIZED', 'Missing or invalid token', 401)
            
            claims = get_jwt()
            user_role = claims.get('role')
            if user_role not in roles:
                return error_response('FORBIDDEN', f'Role {user_role} is not allowed to access this resource', 403)
            
            return fn(*args, **kwargs)
        return decorator
    return wrapper
