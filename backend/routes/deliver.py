import os
import json
import uuid

from flask import Blueprint, request
from werkzeug.utils import secure_filename

from extensions import db
from models.deliver_proposal import DeliverProposal
from models.deliver_team_member import DeliverTeamMember
from models.deliver_file import DeliverFile

from services.auth import (
    jwt_required_custom,
    get_current_user_id
)


deliver_bp = Blueprint("deliver", __name__)


# =========================================================
# UPLOAD FOLDER
# =========================================================

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "uploads",
    "deliver"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =========================================================
# SUBMIT DELIVER PROPOSAL
# =========================================================

@deliver_bp.route("/submit", methods=["POST"])
@jwt_required_custom
def submit_deliver():

    try:

        # =================================================
        # CURRENT USER
        # =================================================
        #
        # User ID frontend se nahi li ja rahi.
        #
        # JWT token se authenticated user ki ID
        # automatically nikali ja rahi hai.
        #

        user_id = get_current_user_id()

        if not user_id:
            return {
                "message": "Invalid user authentication",
                "status": "error"
            }, 401


        # =================================================
        # MAIN DELIVER DATA
        # =================================================

        proposal = DeliverProposal(

            user_id=user_id,

            country=request.form.get("country"),
            title=request.form.get("title"),
            type=request.form.get("type"),
            category=request.form.get("category"),

            description=request.form.get("description"),
            scope=request.form.get("scope"),
            deliverables=request.form.get("deliverables"),

            currency=request.form.get(
                "currency",
                "PKR"
            ),

            amount=request.form.get("amount"),

            included_cost=request.form.get(
                "includedCost"
            ),

            excluded_cost=request.form.get(
                "excludedCost"
            ),

            processing=request.form.get(
                "processing"
            ),

            standard_timeline=request.form.get(
                "standardTimeline"
            ),

            urgent_timeline=request.form.get(
                "urgentTimeline"
            ),

            available_resources=request.form.get(
                "availableResources"
            ),

            required_resources=request.form.get(
                "requiredResources"
            ),

            tools=request.form.get(
                "tools"
            ),

            physical_resources=request.form.get(
                "physicalResources"
            ),

            additional_resources=request.form.get(
                "additionalResources"
            ),

            city=request.form.get(
                "city"
            ),

            full_location=request.form.get(
                "fullLocation"
            ),

            portfolio=request.form.get(
                "portfolio"
            ),

            notification_period=request.form.get(
                "notificationPeriod"
            ),

            notification_details=request.form.get(
                "notificationDetails"
            ),

            communication_method=request.form.get(
                "communicationMethod"
            ),

            communication_details=request.form.get(
                "communicationDetails"
            )
        )


        db.session.add(proposal)

        # Get proposal.id before creating
        # team members and files.
        db.session.flush()


        # =================================================
        # TEAM MEMBERS
        # =================================================

        team_members_data = request.form.get(
            "teamMembers"
        )

        if team_members_data:

            team_members = json.loads(
                team_members_data
            )

            for member in team_members:

                team_member = DeliverTeamMember(

                    deliver_id=proposal.id,

                    name=member.get(
                        "name"
                    ),

                    role=member.get(
                        "role"
                    ),

                    skills=member.get(
                        "skills"
                    ),

                    experience=member.get(
                        "experience"
                    ),

                    profile=member.get(
                        "profile"
                    ),

                    similar_experience=member.get(
                        "similarExperience"
                    )
                )

                db.session.add(
                    team_member
                )


        # =================================================
        # FILE UPLOADS
        # =================================================

        uploaded_files = request.files.getlist(
            "uploadedFiles"
        )

        for file in uploaded_files:

            if file and file.filename:

                original_name = secure_filename(
                    file.filename
                )

                extension = os.path.splitext(
                    original_name
                )[1]

                stored_name = (
                    str(uuid.uuid4())
                    + extension
                )

                file_path = os.path.join(
                    UPLOAD_FOLDER,
                    stored_name
                )

                file.save(
                    file_path
                )


                deliver_file = DeliverFile(

                    deliver_id=proposal.id,

                    original_name=original_name,

                    stored_name=stored_name,

                    file_path=file_path,

                    file_type=file.content_type,

                    file_size=os.path.getsize(
                        file_path
                    )
                )

                db.session.add(
                    deliver_file
                )


        # =================================================
        # SAVE EVERYTHING
        # =================================================

        db.session.commit()


        # =================================================
        # SUCCESS RESPONSE
        # =================================================

        return {
            "message": "Deliver proposal submitted successfully",
            "status": "success",
            "deliver_id": proposal.id
        }, 201


    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as e:

        db.session.rollback()

        return {
            "message": "Failed to submit deliver proposal",
            "status": "error",
            "error": str(e)
        }, 500