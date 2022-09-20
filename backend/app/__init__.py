import os
from flask import Flask
from config import config
from flask_sqlalchemy import SQLAlchemy, inspect

db=SQLAlchemy()

def create_app(name):
    app=Flask(__name__)
    app.config.from_object(config[name])
    config[name].init_app(app)

    db.init_app(app)

    from .commons import before_request_check_token
    @app.before_request
    def check_token():
        before_request_check_token()

    from .auth import auth_bp
    app.register_blueprint(auth_bp)

    from .profile import profile_bp
    app.register_blueprint(profile_bp)

    from .myapplication import myapplication_bp
    app.register_blueprint(myapplication_bp)

    from .myproject import myproject_bp
    app.register_blueprint(myproject_bp)

    from .message import message_bp
    app.register_blueprint(message_bp)

    from .published_project import published_project_bp
    app.register_blueprint(published_project_bp)


    return app

