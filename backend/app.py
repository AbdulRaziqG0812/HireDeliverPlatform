from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db

app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

# Initialize database
db.init_app(app)


# Import models
import models

# Import routes
from routes.auth import auth_bp


# Register routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")


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