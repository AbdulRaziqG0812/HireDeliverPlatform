from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from extensions import db

app = Flask(__name__)

app.config.from_object(Config)

jwt = JWTManager(app)

CORS(app)

# Initialize database
db.init_app(app)


# Import models
import models

# Import routes
from routes.auth import auth_bp
from routes.deliver import deliver_bp
from routes.hire import hire_bp
from routes.dashboard import dashboard_bp
from routes.admin import admin_bp


# Register routes
app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)

app.register_blueprint(
    deliver_bp,
    url_prefix="/api/deliver"
)

app.register_blueprint(
    hire_bp,
    url_prefix="/api/hire"
)

app.register_blueprint(
    dashboard_bp,
    url_prefix="/api/dashboard"
)

app.register_blueprint(
    admin_bp,
    url_prefix="/api/admin"
)


@app.route("/")
def home():
    return {
        "message": "HireDeliver Platform Backend is running!",
        "database": "configured",
        "status": "success"
    }


@app.route("/api/test-db")
def test_db():
    try:
        with db.engine.connect() as connection:
            connection.execute(db.text("SELECT 1"))

        return {
            "message": "MySQL database connected successfully!",
            "status": "success"
        }

    except Exception as e:
        return {
            "message": "Database connection failed",
            "error": str(e),
            "status": "error"
        }, 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)