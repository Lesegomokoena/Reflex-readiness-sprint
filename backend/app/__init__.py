from flask import Flask
from app.config import Config
from app.extensions import db, migrate, jwt, cors
from app.utils.responses import error_response, success_response
from werkzeug.exceptions import HTTPException

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config.get("FRONTEND_ORIGIN")}})

    with app.app_context():
        db.create_all()

    # Register Blueprints
    from app.auth.routes import auth_bp
    from app.deliveries.routes import deliveries_bp
    from app.riders.routes import riders_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(deliveries_bp, url_prefix='/api/deliveries')
    app.register_blueprint(riders_bp, url_prefix='/api/riders')

    @app.route('/')
    def index():
        return success_response({'message': 'Reflex API is running. Access endpoints under /api/*'})

    # Register error handlers
    @app.errorhandler(HTTPException)
    def handle_exception(e):
        return error_response('HTTP_EXCEPTION', e.description, e.code)

    @app.errorhandler(Exception)
    def handle_unexpected_error(e):
        return error_response('INTERNAL_SERVER_ERROR', 'An unexpected error occurred', 500)

    return app
