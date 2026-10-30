from flask import Blueprint

from models.user import User
from models.hire_requirement import HireRequirement
from models.hire_file import HireFile
from models.deliver_proposal import DeliverProposal
from models.deliver_team_member import DeliverTeamMember
from models.deliver_file import DeliverFile

from services.auth import (
    jwt_required_custom,
    get_current_user_id
)


dashboard_bp = Blueprint(
    "dashboard",
    __name__
)


@dashboard_bp.route(
    "/",
    methods=["GET"]
)
@jwt_required_custom
def get_dashboard():

    user_id = get_current_user_id()

    # Admin dashboard is handled separately
    if not user_id:
        return {
            "message": "User dashboard is only available for normal users",
            "status": "error"
        }, 403

    # --------------------------------------------------
    # Current user
    # --------------------------------------------------

    user = User.query.filter_by(
        id=user_id
    ).first()

    if not user:
        return {
            "message": "User not found",
            "status": "error"
        }, 404

    # --------------------------------------------------
    # User's Hire Requirements
    # --------------------------------------------------

    hire_records = HireRequirement.query.filter_by(
        user_id=user_id
    ).order_by(
        HireRequirement.created_at.desc()
    ).all()

    hires = []

    for hire in hire_records:

        files = HireFile.query.filter_by(
            hire_id=hire.id
        ).all()

        hire_files = []

        for file in files:

            hire_files.append({
                "id": file.id,
                "original_name": file.original_name,
                "stored_name": file.stored_name,
                "file_type": file.file_type,
                "file_size": file.file_size,
                "uploaded_at": (
                    file.uploaded_at.isoformat()
                    if file.uploaded_at
                    else None
                )
            })

        hires.append({

            "id": hire.id,


            "title": hire.title,

            "type": hire.type,

            "category": hire.category,

            "description": hire.description,

            "scope": hire.scope,

            "deliverables": hire.deliverables,

            "budget": hire.budget,

            "processing": hire.processing,

            "standard_timeline": hire.standard_timeline,

            "urgent_timeline": hire.urgent_timeline,

            "human_resources": hire.human_resources,

            "roles": hire.roles,

            "skills": hire.skills,

            "tools": hire.tools,

            "physical_resources": hire.physical_resources,

            "additional_resources": hire.additional_resources,

            "location": hire.location,

            "full_location": hire.full_location,

            "communication_method": hire.communication_method,

            "notification_period": hire.notification_period,

            "status": hire.status,

            "files": hire_files,

            "created_at": (
                hire.created_at.isoformat()
                if hire.created_at
                else None
            ),

            "updated_at": (
                hire.updated_at.isoformat()
                if hire.updated_at
                else None
            )
        })

    # --------------------------------------------------
    # User's Deliver Proposals
    # --------------------------------------------------

    deliver_records = DeliverProposal.query.filter_by(
        user_id=user_id
    ).order_by(
        DeliverProposal.created_at.desc()
    ).all()

    delivers = []

    for deliver in deliver_records:

        # Team members
        team_members = DeliverTeamMember.query.filter_by(
            deliver_id=deliver.id
        ).all()

        team = []

        for member in team_members:

            team.append({

                "id": member.id,

                "name": member.name,

                "role": member.role,

                "skills": member.skills,

                "experience": member.experience,

                "profile": member.profile,

                "similar_experience": (
                    member.similar_experience
                )
            })

        # Uploaded files
        files = DeliverFile.query.filter_by(
            deliver_id=deliver.id
        ).all()

        deliver_files = []

        for file in files:

            deliver_files.append({

                "id": file.id,

                "original_name": file.original_name,

                "stored_name": file.stored_name,

                "file_type": file.file_type,

                "file_size": file.file_size,

                "uploaded_at": (
                    file.uploaded_at.isoformat()
                    if file.uploaded_at
                    else None
                )
            })

        delivers.append({

            "id": deliver.id,

            "country": deliver.country,

            "title": deliver.title,

            "type": deliver.type,

            "category": deliver.category,

            "description": deliver.description,

            "scope": deliver.scope,

            "deliverables": deliver.deliverables,

            "currency": deliver.currency,

            "amount": (
                float(deliver.amount)
                if deliver.amount is not None
                else None
            ),

            "included_cost": deliver.included_cost,

            "excluded_cost": deliver.excluded_cost,

            "processing": deliver.processing,

            "standard_timeline": (
                deliver.standard_timeline
            ),

            "urgent_timeline": (
                deliver.urgent_timeline
            ),

            "available_resources": (
                deliver.available_resources
            ),

            "required_resources": (
                deliver.required_resources
            ),

            "tools": deliver.tools,

            "physical_resources": (
                deliver.physical_resources
            ),

            "additional_resources": (
                deliver.additional_resources
            ),

            "city": deliver.city,

            "full_location": (
                deliver.full_location
            ),

            "portfolio": deliver.portfolio,

            "notification_period": (
                deliver.notification_period
            ),

            "notification_details": (
                deliver.notification_details
            ),

            "communication_method": (
                deliver.communication_method
            ),

            "communication_details": (
                deliver.communication_details
            ),

            "status": deliver.status,

            "team_members": team,

            "files": deliver_files,

            "created_at": (
                deliver.created_at.isoformat()
                if deliver.created_at
                else None
            ),

            "updated_at": (
                deliver.updated_at.isoformat()
                if deliver.updated_at
                else None
            )
        })

    # --------------------------------------------------
    # Final Dashboard Response
    # --------------------------------------------------

    return {

        "message": "Dashboard data loaded successfully",

        "status": "success",

        "user": {

            "id": user.id,

            "name": user.name,

            "email": user.email,

            "phone": user.phone,

            "role": user.role
        },

        "summary": {

            "total_hires": len(hires),

            "total_delivers": len(delivers),

            "total_submissions": (
                len(hires) + len(delivers)
            )
        },

        "hires": hires,

        "delivers": delivers

    }, 200