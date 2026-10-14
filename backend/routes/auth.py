from flask import Blueprint, request
from werkzeug.security import generate_password_hash
from extensions import db
from models.user import User


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return {
            "message": "Name, email and password are required",
            "status": "error"
        }, 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return {
            "message": "Email already registered",
            "status": "error"
        }, 409

    new_user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password)
    )

    db.session.add(new_user)
    db.session.commit()

    return {
        "message": "User registered successfully",
        "status": "success",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }, 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {
            "message": "Email and password are required",
            "status": "error"
        }, 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return {
            "message": "Invalid email or password",
            "status": "error"
        }, 401

    if not user.check_password(password):
        return {
            "message": "Invalid email or password",
            "status": "error"
        }, 401

    return {
        "message": "Login successful",
        "status": "success",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }, 200