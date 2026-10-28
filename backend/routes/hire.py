import os
import uuid

from flask import Blueprint, request
from werkzeug.utils import secure_filename

from extensions import db

from models.hire_requirement import HireRequirement
from models.hire_file import HireFile

from services.auth import (
    jwt_required_custom,
    get_current_user_id
)


hire_bp = Blueprint("hire", __name__)


# --------------------------------------------------
# Hire file upload folder
# --------------------------------------------------

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    ),
    "uploads",
    "hire"
)


os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# --------------------------------------------------
# Submit Hire Requirement
# --------------------------------------------------

@hire_bp.route(
    "/submit",
    methods=["POST"]
)
@jwt_required_custom
def submit_hire():

    # Get user ID from JWT
    # Never trust user_id coming from frontend
    user_id = get_current_user_id()

    if not user_id:
        return {
            "message": "Invalid user authentication",
            "status": "error"
        }, 401


    # --------------------------------------------------
    # Required fields
    # --------------------------------------------------

    required_fields = [
        "title",
        "type",
        "category",
        "description",
        "budget",
        "processing",
        "standardTimeline",
        "location",
        "communicationMethod"
    ]


    for field in required_fields:

        value = request.form.get(
            field,
            ""
        ).strip()

        if not value:

            return {
                "message": f"{field} is required",
                "status": "error"
            }, 400


    try:

        # --------------------------------------------------
        # Create Hire Requirement
        # --------------------------------------------------

        hire = HireRequirement(

            user_id=user_id,

            title=request.form.get(
                "title",
                ""
            ).strip(),

            type=request.form.get(
                "type",
                ""
            ).strip(),

            category=request.form.get(
                "category",
                ""
            ).strip(),

            description=request.form.get(
                "description",
                ""
            ).strip(),

            scope=request.form.get(
                "scope",
                ""
            ).strip(),

            deliverables=request.form.get(
                "deliverables",
                ""
            ).strip(),

            budget=request.form.get(
                "budget",
                ""
            ).strip(),

            processing=request.form.get(
                "processing",
                ""
            ).strip(),

            standard_timeline=request.form.get(
                "standardTimeline",
                ""
            ).strip(),

            urgent_timeline=request.form.get(
                "urgentTimeline",
                ""
            ).strip(),

            human_resources=request.form.get(
                "humanResources",
                ""
            ).strip(),

            roles=request.form.get(
                "roles",
                ""
            ).strip(),

            skills=request.form.get(
                "skills",
                ""
            ).strip(),

            tools=request.form.get(
                "tools",
                ""
            ).strip(),

            physical_resources=request.form.get(
                "physicalResources",
                ""
            ).strip(),

            additional_resources=request.form.get(
                "additionalResources",
                ""
            ).strip(),

            location=request.form.get(
                "location",
                ""
            ).strip(),

            full_location=request.form.get(
                "fullLocation",
                ""
            ).strip(),

            communication_method=request.form.get(
                "communicationMethod",
                ""
            ).strip(),

            notification_period=request.form.get(
                "notificationPeriod",
                ""
            ).strip()
        )


        db.session.add(hire)

        # Get generated Hire ID
        db.session.flush()


        # --------------------------------------------------
        # Handle uploaded files
        # --------------------------------------------------

        uploaded_files = request.files.getlist(
            "uploadedFiles"
        )


        for file in uploaded_files:

            if not file or not file.filename:
                continue


            # Original filename
            original_name = secure_filename(
                file.filename
            )


            # File extension
            extension = os.path.splitext(
                original_name
            )[1]


            # Unique stored filename
            stored_name = (
                f"{uuid.uuid4()}"
                f"{extension}"
            )


            # Complete file path
            file_path = os.path.join(
                UPLOAD_FOLDER,
                stored_name
            )


            # Save physical file
            file.save(file_path)


            # Save file information in database
            hire_file = HireFile(

                hire_id=hire.id,

                original_name=original_name,

                stored_name=stored_name,

                file_path=file_path,

                file_type=file.mimetype,

                file_size=os.path.getsize(
                    file_path
                )
            )


            db.session.add(
                hire_file
            )


        # --------------------------------------------------
        # Save everything
        # --------------------------------------------------

        db.session.commit()


        return {

            "message": (
                "Hire requirement "
                "submitted successfully"
            ),

            "status": "success",

            "hire": {

                "id": hire.id,

                "user_id": hire.user_id,

                "title": hire.title,

                "type": hire.type,

                "category": hire.category,

                "budget": hire.budget,

                "created_at": (
                    hire.created_at.isoformat()
                    if hire.created_at
                    else None
                )
            }

        }, 201


    except Exception as e:

        # Rollback database changes
        db.session.rollback()


        return {

            "message": (
                "Failed to submit "
                "hire requirement"
            ),

            "error": str(e),

            "status": "error"

        }, 500