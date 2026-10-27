from flask import Blueprint, request
from werkzeug.security import generate_password_hash

from flask_jwt_extended import create_access_token

from extensions import db
from models.user import User
from config import Config


auth_bp = Blueprint("auth", __name__)


# =========================================================
# REGISTER / SIGN UP
# =========================================================
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    # -----------------------------------------------------
    # Required fields validation
    # -----------------------------------------------------
    if not name or not email or not phone or not password:
        return {
            "message": "Name, email, phone and password are required",
            "status": "error"
        }, 400

    # -----------------------------------------------------
    # Check if email already exists
    # -----------------------------------------------------
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return {
            "message": "Email already registered",
            "status": "error"
        }, 409

    # -----------------------------------------------------
    # Create normal user
    # -----------------------------------------------------
    new_user = User(
        name=name,
        email=email,
        phone=phone,
        password_hash=generate_password_hash(password),
        role="user"
    )

    db.session.add(new_user)
    db.session.commit()

    return {
        "message": "User registered successfully",
        "status": "success",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "phone": new_user.phone,
            "role": new_user.role
        }
    }, 201


# =========================================================
# LOGIN
# =========================================================
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # -----------------------------------------------------
    # Required fields validation
    # -----------------------------------------------------
    if not email or not password:
        return {
            "message": "Email and password are required",
            "status": "error"
        }, 400

    # =====================================================
    # ADMIN LOGIN
    # =====================================================
    #
    # Admin is NOT created through Signup.
    # Admin credentials come from backend .env file.
    #
    if (
        email == Config.ADMIN_EMAIL
        and password == Config.ADMIN_PASSWORD
    ):

        # -------------------------------------------------
        # Create JWT token for admin
        # -------------------------------------------------
        access_token = create_access_token(
            identity="admin",
            additional_claims={
                "role": "admin"
            }
        )

        return {
            "message": "Admin login successful",
            "status": "success",
            "account_type": "admin",
            "access_token": access_token,
            "user": {
                "name": "Administrator",
                "email": email,
                "role": "admin"
            }
        }, 200

    # =====================================================
    # NORMAL USER LOGIN
    # =====================================================

    # Find user in database
    user = User.query.filter_by(email=email).first()

    # -----------------------------------------------------
    # User not found
    # -----------------------------------------------------
    if not user:
        return {
            "message": "Invalid email or password",
            "status": "error"
        }, 401

    # -----------------------------------------------------
    # Check password
    # -----------------------------------------------------
    if not user.check_password(password):
        return {
            "message": "Invalid email or password",
            "status": "error"
        }, 401

    # -----------------------------------------------------
    # Create JWT token for normal user
    # -----------------------------------------------------
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role
        }
    )

    # -----------------------------------------------------
    # Normal user login successful
    # -----------------------------------------------------
    return {
        "message": "Login successful",
        "status": "success",
        "account_type": "user",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role
        }
    }, 200