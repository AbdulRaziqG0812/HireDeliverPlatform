from functools import wraps

from flask import jsonify
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt,
    get_jwt_identity
)


def jwt_required_custom(fn):

    @wraps(fn)
    def wrapper(*args, **kwargs):

        try:
            verify_jwt_in_request()

            return fn(*args, **kwargs)

        except Exception:
            return jsonify({
                "message": "Authentication required",
                "status": "error"
            }), 401

    return wrapper


def get_current_user_id():

    identity = get_jwt_identity()

    if identity == "admin":
        return None

    return int(identity)


def get_current_user_role():

    claims = get_jwt()

    return claims.get("role")


def admin_required(fn):

    @wraps(fn)
    def wrapper(*args, **kwargs):

        try:
            verify_jwt_in_request()

            role = get_current_user_role()

            if role != "admin":
                return jsonify({
                    "message": "Admin access required",
                    "status": "error"
                }), 403

            return fn(*args, **kwargs)

        except Exception:
            return jsonify({
                "message": "Authentication required",
                "status": "error"
            }), 401

    return wrapper