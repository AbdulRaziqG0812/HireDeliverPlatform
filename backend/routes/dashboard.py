from flask import Blueprint, request
import csv
import hashlib
import io
import json
import uuid

from openpyxl import load_workbook

from extensions import db
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


# =========================================================
# CONSTANTS / HELPERS
# =========================================================

ALLOWED_EDIT_FIELDS = {
    "hire": [
        "country", "currency", "title", "type", "category",
        "description", "scope", "deliverables", "budget",
        "processing", "standardTimeline", "urgentTimeline",
        "humanResources", "roles", "skills", "tools",
        "physicalResources", "additionalResources", "location",
        "fullLocation", "communicationMethod", "notificationPeriod",
    ],
    "deliver": [
        "country", "title", "type", "category", "description",
        "scope", "deliverables", "currency", "amount",
        "included_cost", "excluded_cost", "processing",
        "standardTimeline", "urgentTimeline", "teamMembers",
        "availableResources", "requiredResources", "tools",
        "physicalResources", "additionalResources", "city",
        "fullLocation", "portfolio", "social_media_link",
        "notificationPeriod", "notificationDetails",
        "communicationMethod", "communicationDetails",
    ],
}

REQUIRED_FIELDS = {
    "hire": [
        "title", "type", "category", "description",
        "budget", "processing", "standardTimeline",
        "location", "communicationMethod",
    ],
    "deliver": [
        "title", "type", "category", "description",
        "currency", "amount", "processing", "standardTimeline",
        "city", "communicationMethod",
    ],
}


def is_record_visible(status):
    """
    A normal user can see complete record details only
    after admin approval.

    Pending  -> hidden
    Rejected -> hidden
    Approved -> visible
    In Progress -> visible
    Completed -> visible
    """

    return status in [
        "Approved",
        "In Progress",
        "Completed"
    ]


def clean_value(value):
    if value is None:
        return ""
    return str(value).strip()


def get_value(data, camel_name, snake_name=None, default=""):
    value = data.get(camel_name)

    if value is None and snake_name:
        value = data.get(snake_name)

    if value is None:
        return default

    return value


def validate_required(data, record_type):
    missing = []

    for field in REQUIRED_FIELDS[record_type]:
        value = get_value(
            data,
            field,
            field
        )

        if clean_value(value) == "":
            missing.append(field)

    if missing:
        return (
            "Missing required fields: "
            + ", ".join(missing)
        )

    return None


def build_record_hash(user_id, title, description, scope):
    duplicate_string = "|".join([
        str(user_id),
        clean_value(title).lower(),
        clean_value(description).lower(),
        clean_value(scope).lower(),
    ])

    return hashlib.sha256(
        duplicate_string.encode("utf-8")
    ).hexdigest()


def get_hire_duplicate(user_id, record_hash, current_id=None):
    query = HireRequirement.query.filter_by(
        user_id=user_id,
        record_hash=record_hash
    )

    if current_id is not None:
        query = query.filter(
            HireRequirement.id != current_id
        )

    return query.first()


def get_deliver_duplicate(user_id, record_hash, current_id=None):
    query = DeliverProposal.query.filter_by(
        user_id=user_id,
        record_hash=record_hash
    )

    if current_id is not None:
        query = query.filter(
            DeliverProposal.id != current_id
        )

    return query.first()


def parse_team_members(value):
    if value in (None, ""):
        return []

    if isinstance(value, list):
        raw_members = value
    elif isinstance(value, dict):
        raw_members = [value]
    else:
        try:
            raw_members = json.loads(str(value))
        except (TypeError, ValueError, json.JSONDecodeError):
            raise ValueError(
                "teamMembers must contain valid JSON."
            )

        if isinstance(raw_members, dict):
            raw_members = [raw_members]

    if not isinstance(raw_members, list):
        raise ValueError(
            "teamMembers must be a JSON array."
        )

    members = []

    for item in raw_members:
        if not isinstance(item, dict):
            continue

        members.append({
            "name": clean_value(item.get("name")),
            "role": clean_value(item.get("role")),
            "skills": clean_value(item.get("skills")),
            "experience": clean_value(item.get("experience")),
            "profile": clean_value(
                item.get("profile")
                or item.get("profileFiles")
            ),
            "similar_experience": clean_value(
                item.get("similar_experience")
                or item.get("similarExperience")
            ),
        })

    return members


def parse_amount(value):
    if value in (None, ""):
        return None

    try:
        return float(value)
    except (TypeError, ValueError):
        raise ValueError(
            "amount must be a valid number."
        )


def read_import_rows(uploaded_file):
    filename = (uploaded_file.filename or "").lower()

    if not filename:
        raise ValueError("Please select an Excel or CSV file.")

    if filename.endswith(".csv"):
        raw = uploaded_file.read()

        try:
            text = raw.decode("utf-8-sig")
        except UnicodeDecodeError:
            text = raw.decode("utf-8", errors="replace")

        reader = csv.DictReader(
            io.StringIO(text)
        )

        if not reader.fieldnames:
            raise ValueError(
                "The CSV file does not contain field names."
            )

        return [
            {
                str(key).strip(): value
                for key, value in row.items()
                if key is not None
            }
            for row in reader
        ]

    if filename.endswith(".xlsx"):
        workbook = load_workbook(
            uploaded_file,
            read_only=True,
            data_only=True
        )

        sheet = workbook.active
        rows = sheet.iter_rows(
            values_only=True
        )

        try:
            headers = next(rows)
        except StopIteration:
            workbook.close()
            return []

        headers = [
            clean_value(header)
            for header in headers
        ]

        if not any(headers):
            workbook.close()
            raise ValueError(
                "The Excel file does not contain field names."
            )

        result = []

        for row in rows:
            if not any(
                clean_value(cell)
                for cell in row
            ):
                continue

            item = {}

            for index, header in enumerate(headers):
                if not header:
                    continue

                item[header] = (
                    row[index]
                    if index < len(row)
                    else ""
                )

            result.append(item)

        workbook.close()
        return result

    raise ValueError(
        "Unsupported file format. Please use .xlsx or .csv."
    )


def delete_hire_files(hire_id):
    files = HireFile.query.filter_by(
        hire_id=hire_id
    ).all()

    for file in files:
        db.session.delete(file)


def delete_deliver_team_members(deliver_id):
    team_members = DeliverTeamMember.query.filter_by(
        deliver_id=deliver_id
    ).all()

    for member in team_members:
        db.session.delete(member)


def delete_deliver_children(deliver_id):
    delete_deliver_team_members(deliver_id)

    files = DeliverFile.query.filter_by(
        deliver_id=deliver_id
    ).all()

    for file in files:
        db.session.delete(file)


def add_deliver_team_members(deliver_id, team_members):
    for member in team_members:
        db.session.add(
            DeliverTeamMember(
                deliver_id=deliver_id,
                name=member.get("name", ""),
                role=member.get("role", ""),
                skills=member.get("skills", ""),
                experience=member.get("experience", ""),
                profile=member.get("profile", ""),
                similar_experience=member.get(
                    "similar_experience",
                    ""
                ),
            )
        )


def create_hire_from_data(user_id, data):
    validation_error = validate_required(
        data,
        "hire"
    )

    if validation_error:
        raise ValueError(validation_error)

    title = clean_value(data.get("title"))
    description = clean_value(
        data.get("description")
    )
    scope = clean_value(
        data.get("scope")
    )

    record_hash = build_record_hash(
        user_id,
        title,
        description,
        scope
    )

    duplicate = get_hire_duplicate(
        user_id,
        record_hash
    )

    if duplicate:
        raise ValueError(
            "Duplicate entry. You have already submitted "
            f"this Hire requirement: '{duplicate.title}'. "
            "Please change the Title, Description, or Scope "
            "before submitting again."
        )

    hire = HireRequirement(
        user_id=user_id,
        record_key=f"HIRE-{uuid.uuid4().hex}",
        record_hash=record_hash,
        country=clean_value(
            data.get("country")
        ) or "Pakistan",
        currency=clean_value(
            data.get("currency")
        ) or "PKR - Pakistani Rupee",
        title=title,
        type=clean_value(data.get("type")),
        category=clean_value(
            data.get("category")
        ),
        description=description,
        scope=scope,
        deliverables=clean_value(
            data.get("deliverables")
        ),
        budget=clean_value(
            data.get("budget")
        ),
        processing=clean_value(
            data.get("processing")
        ),
        standard_timeline=clean_value(
            get_value(
                data,
                "standardTimeline",
                "standard_timeline"
            )
        ),
        urgent_timeline=clean_value(
            get_value(
                data,
                "urgentTimeline",
                "urgent_timeline"
            )
        ),
        human_resources=clean_value(
            get_value(
                data,
                "humanResources",
                "human_resources"
            )
        ),
        roles=clean_value(
            data.get("roles")
        ),
        skills=clean_value(
            data.get("skills")
        ),
        tools=clean_value(
            data.get("tools")
        ),
        physical_resources=clean_value(
            get_value(
                data,
                "physicalResources",
                "physical_resources"
            )
        ),
        additional_resources=clean_value(
            get_value(
                data,
                "additionalResources",
                "additional_resources"
            )
        ),
        location=clean_value(
            data.get("location")
        ),
        full_location=clean_value(
            get_value(
                data,
                "fullLocation",
                "full_location"
            )
        ),
        communication_method=clean_value(
            get_value(
                data,
                "communicationMethod",
                "communication_method"
            )
        ),
        notification_period=clean_value(
            get_value(
                data,
                "notificationPeriod",
                "notification_period"
            )
        ),
        status="Pending",
    )

    db.session.add(hire)
    return hire


def create_deliver_from_data(user_id, data):
    validation_error = validate_required(
        data,
        "deliver"
    )

    if validation_error:
        raise ValueError(validation_error)

    title = clean_value(data.get("title"))
    description = clean_value(
        data.get("description")
    )
    scope = clean_value(
        data.get("scope")
    )

    record_hash = build_record_hash(
        user_id,
        title,
        description,
        scope
    )

    duplicate = get_deliver_duplicate(
        user_id,
        record_hash
    )

    if duplicate:
        raise ValueError(
            "Duplicate entry. You have already submitted "
            f"this Deliver record: '{duplicate.title}'. "
            "Please change the Title, Description, or Scope "
            "before submitting again."
        )

    amount = parse_amount(
        data.get("amount")
    )

    team_members = parse_team_members(
        get_value(
            data,
            "teamMembers",
            "team_members"
        )
    )

    deliver = DeliverProposal(
        user_id=user_id,
        record_key=f"DELIVER-{uuid.uuid4().hex}",
        record_hash=record_hash,
        country=clean_value(
            data.get("country")
        ) or "Pakistan",
        title=title,
        type=clean_value(data.get("type")),
        category=clean_value(
            data.get("category")
        ),
        description=description,
        scope=scope,
        deliverables=clean_value(
            data.get("deliverables")
        ),
        currency=clean_value(
            data.get("currency")
        ),
        amount=amount,
        included_cost=clean_value(
            data.get("included_cost")
        ),
        excluded_cost=clean_value(
            data.get("excluded_cost")
        ),
        processing=clean_value(
            data.get("processing")
        ),
        standard_timeline=clean_value(
            get_value(
                data,
                "standardTimeline",
                "standard_timeline"
            )
        ),
        urgent_timeline=clean_value(
            get_value(
                data,
                "urgentTimeline",
                "urgent_timeline"
            )
        ),
        available_resources=clean_value(
            get_value(
                data,
                "availableResources",
                "available_resources"
            )
        ),
        required_resources=clean_value(
            get_value(
                data,
                "requiredResources",
                "required_resources"
            )
        ),
        tools=clean_value(
            data.get("tools")
        ),
        physical_resources=clean_value(
            get_value(
                data,
                "physicalResources",
                "physical_resources"
            )
        ),
        additional_resources=clean_value(
            get_value(
                data,
                "additionalResources",
                "additional_resources"
            )
        ),
        city=clean_value(
            data.get("city")
        ),
        full_location=clean_value(
            get_value(
                data,
                "fullLocation",
                "full_location"
            )
        ),
        portfolio=clean_value(
            data.get("portfolio")
        ),
        social_media_link=clean_value(
            data.get("social_media_link")
        ),
        notification_period=clean_value(
            get_value(
                data,
                "notificationPeriod",
                "notification_period"
            )
        ),
        notification_details=clean_value(
            get_value(
                data,
                "notificationDetails",
                "notification_details"
            )
        ),
        communication_method=clean_value(
            get_value(
                data,
                "communicationMethod",
                "communication_method"
            )
        ),
        communication_details=clean_value(
            get_value(
                data,
                "communicationDetails",
                "communication_details"
            )
        ),
        status="Pending",
    )

    db.session.add(deliver)
    db.session.flush()

    add_deliver_team_members(
        deliver.id,
        team_members
    )

    return deliver


def update_hire_from_data(hire, data):
    validation_error = validate_required(
        data,
        "hire"
    )

    if validation_error:
        raise ValueError(validation_error)

    hire.country = clean_value(
        data.get("country")
    ) or "Pakistan"
    hire.currency = clean_value(
        data.get("currency")
    ) or "PKR - Pakistani Rupee"
    hire.title = clean_value(
        data.get("title")
    )
    hire.type = clean_value(
        data.get("type")
    )
    hire.category = clean_value(
        data.get("category")
    )
    hire.description = clean_value(
        data.get("description")
    )
    hire.scope = clean_value(
        data.get("scope")
    )
    hire.deliverables = clean_value(
        data.get("deliverables")
    )
    hire.budget = clean_value(
        data.get("budget")
    )
    hire.processing = clean_value(
        data.get("processing")
    )
    hire.standard_timeline = clean_value(
        get_value(
            data,
            "standardTimeline",
            "standard_timeline"
        )
    )
    hire.urgent_timeline = clean_value(
        get_value(
            data,
            "urgentTimeline",
            "urgent_timeline"
        )
    )
    hire.human_resources = clean_value(
        get_value(
            data,
            "humanResources",
            "human_resources"
        )
    )
    hire.roles = clean_value(
        data.get("roles")
    )
    hire.skills = clean_value(
        data.get("skills")
    )
    hire.tools = clean_value(
        data.get("tools")
    )
    hire.physical_resources = clean_value(
        get_value(
            data,
            "physicalResources",
            "physical_resources"
        )
    )
    hire.additional_resources = clean_value(
        get_value(
            data,
            "additionalResources",
            "additional_resources"
        )
    )
    hire.location = clean_value(
        data.get("location")
    )
    hire.full_location = clean_value(
        get_value(
            data,
            "fullLocation",
            "full_location"
        )
    )
    hire.communication_method = clean_value(
        get_value(
            data,
            "communicationMethod",
            "communication_method"
        )
    )
    hire.notification_period = clean_value(
        get_value(
            data,
            "notificationPeriod",
            "notification_period"
        )
    )

    return hire


def update_deliver_from_data(deliver, data):
    validation_error = validate_required(
        data,
        "deliver"
    )

    if validation_error:
        raise ValueError(validation_error)

    deliver.country = clean_value(
        data.get("country")
    ) or "Pakistan"
    deliver.title = clean_value(
        data.get("title")
    )
    deliver.type = clean_value(
        data.get("type")
    )
    deliver.category = clean_value(
        data.get("category")
    )
    deliver.description = clean_value(
        data.get("description")
    )
    deliver.scope = clean_value(
        data.get("scope")
    )
    deliver.deliverables = clean_value(
        data.get("deliverables")
    )
    deliver.currency = clean_value(
        data.get("currency")
    )
    deliver.amount = parse_amount(
        data.get("amount")
    )
    deliver.included_cost = clean_value(
        data.get("included_cost")
    )
    deliver.excluded_cost = clean_value(
        data.get("excluded_cost")
    )
    deliver.processing = clean_value(
        data.get("processing")
    )
    deliver.standard_timeline = clean_value(
        get_value(
            data,
            "standardTimeline",
            "standard_timeline"
        )
    )
    deliver.urgent_timeline = clean_value(
        get_value(
            data,
            "urgentTimeline",
            "urgent_timeline"
        )
    )
    deliver.available_resources = clean_value(
        get_value(
            data,
            "availableResources",
            "available_resources"
        )
    )
    deliver.required_resources = clean_value(
        get_value(
            data,
            "requiredResources",
            "required_resources"
        )
    )
    deliver.tools = clean_value(
        data.get("tools")
    )
    deliver.physical_resources = clean_value(
        get_value(
            data,
            "physicalResources",
            "physical_resources"
        )
    )
    deliver.additional_resources = clean_value(
        get_value(
            data,
            "additionalResources",
            "additional_resources"
        )
    )
    deliver.city = clean_value(
        data.get("city")
    )
    deliver.full_location = clean_value(
        get_value(
            data,
            "fullLocation",
            "full_location"
        )
    )
    deliver.portfolio = clean_value(
        data.get("portfolio")
    )
    deliver.social_media_link = clean_value(
        data.get("social_media_link")
    )
    deliver.notification_period = clean_value(
        get_value(
            data,
            "notificationPeriod",
            "notification_period"
        )
    )
    deliver.notification_details = clean_value(
        get_value(
            data,
            "notificationDetails",
            "notification_details"
        )
    )
    deliver.communication_method = clean_value(
        get_value(
            data,
            "communicationMethod",
            "communication_method"
        )
    )
    deliver.communication_details = clean_value(
        get_value(
            data,
            "communicationDetails",
            "communication_details"
        )
    )

    return deliver


# =========================================================
# USER DASHBOARD
# =========================================================



@dashboard_bp.route(
    "/",
    methods=["GET"]
)
@jwt_required_custom
def get_dashboard():

    user_id = get_current_user_id()

    # ------------------------------------------------------
    # Admin dashboard is handled separately
    # ------------------------------------------------------

    if not user_id:
        return {
            "message": "User dashboard is only available for normal users",
            "status": "error"
        }, 403


    # ------------------------------------------------------
    # Current User
    # ------------------------------------------------------

    user = User.query.filter_by(
        id=user_id
    ).first()

    if not user:
        return {
            "message": "User not found",
            "status": "error"
        }, 404


    # ======================================================
    # HIRE RECORDS
    # ======================================================

    hire_records = HireRequirement.query.filter_by(
        user_id=user_id
    ).order_by(
        HireRequirement.created_at.desc()
    ).all()

    hires = []


    for hire in hire_records:

        status = hire.status or "Pending"

        # ==================================================
        # PENDING / REJECTED
        # ==================================================
        #
        # Do NOT expose complete form data.
        #

        if not is_record_visible(status):

            hires.append({

                "id": hire.id,

                "country": hire.country,

                "title": hire.title,

                "type": hire.type,

                "category": hire.category,

                "status": status,

                "approval_required": (
                    status == "Pending"
                ),

                "approval_message": (
                    "Waiting for Admin Approval"
                    if status == "Pending"
                    else
                    "This Hire submission was not approved."
                ),

                "files": [],

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

            continue


        # ==================================================
        # APPROVED / IN PROGRESS / COMPLETED
        # ==================================================

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

            "country": hire.country,

            "title": hire.title,

            "type": hire.type,

            "category": hire.category,

            "description": hire.description,

            "scope": hire.scope,

            "deliverables": hire.deliverables,

            "currency": hire.currency,

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

            "status": status,

            "approval_required": False,

            "approval_message": None,

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


    # ======================================================
    # DELIVER RECORDS
    # ======================================================

    deliver_records = DeliverProposal.query.filter_by(
        user_id=user_id
    ).order_by(
        DeliverProposal.created_at.desc()
    ).all()

    delivers = []


    for deliver in deliver_records:

        status = deliver.status or "Pending"


        # ==================================================
        # PENDING / REJECTED
        # ==================================================
        #
        # Do NOT expose complete form data.
        #

        if not is_record_visible(status):

            delivers.append({

                "id": deliver.id,

                "country": deliver.country,

                "title": deliver.title,

                "type": deliver.type,

                "category": deliver.category,

                "status": status,

                "approval_required": (
                    status == "Pending"
                ),

                "approval_message": (
                    "Waiting for Admin Approval"
                    if status == "Pending"
                    else
                    "This Deliver submission was not approved."
                ),

                "team_members": [],

                "files": [],

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

            continue


        # ==================================================
        # TEAM MEMBERS
        # ==================================================

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


        # ==================================================
        # UPLOADED FILES
        # ==================================================

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


        # ==================================================
        # APPROVED / IN PROGRESS / COMPLETED
        # ==================================================

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

            "social_media_link": deliver.social_media_link,

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

            "status": status,

            "approval_required": False,

            "approval_message": None,

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


    # ======================================================
    # SUMMARY
    # ======================================================

    pending_hires = sum(
        1
        for hire in hires
        if hire.get("status") == "Pending"
    )

    pending_delivers = sum(
        1
        for deliver in delivers
        if deliver.get("status") == "Pending"
    )


    approved_hires = sum(
        1
        for hire in hires
        if hire.get("status") == "Approved"
    )

    approved_delivers = sum(
        1
        for deliver in delivers
        if deliver.get("status") == "Approved"
    )


    # ======================================================
    # FINAL RESPONSE
    # ======================================================

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
            ),

            "pending_hires": pending_hires,

            "pending_delivers": pending_delivers,

            "approved_hires": approved_hires,

            "approved_delivers": approved_delivers
        },

        "hires": hires,

        "delivers": delivers

    }, 200


# =========================================================
# USER RECORD ACTIONS
# =========================================================

@dashboard_bp.route(
    "/records/<record_type>/<int:record_id>",
    methods=["DELETE"]
)
@jwt_required_custom
def delete_user_record(record_type, record_id):

    user_id = get_current_user_id()

    if not user_id:
        return {
            "status": "error",
            "message": "User dashboard is only available for normal users"
        }, 403

    if record_type == "hire":
        record = HireRequirement.query.filter_by(
            id=record_id,
            user_id=user_id
        ).first()

        if not record:
            return {
                "status": "error",
                "message": "Hire record not found."
            }, 404

        delete_hire_files(record.id)
        db.session.delete(record)

    elif record_type == "deliver":
        record = DeliverProposal.query.filter_by(
            id=record_id,
            user_id=user_id
        ).first()

        if not record:
            return {
                "status": "error",
                "message": "Deliver record not found."
            }, 404

        delete_deliver_children(record.id)
        db.session.delete(record)

    else:
        return {
            "status": "error",
            "message": "Invalid record type."
        }, 400

    try:
        db.session.commit()

        return {
            "status": "success",
            "message": (
                f"{record_type.title()} record deleted successfully."
            )
        }, 200

    except Exception as exc:
        db.session.rollback()

        return {
            "status": "error",
            "message": (
                "Unable to delete record."
            ),
            "detail": str(exc)
        }, 500


@dashboard_bp.route(
    "/records/<record_type>/<int:record_id>",
    methods=["PUT"]
)
@jwt_required_custom
def update_user_record(record_type, record_id):

    user_id = get_current_user_id()

    if not user_id:
        return {
            "status": "error",
            "message": "User dashboard is only available for normal users"
        }, 403

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {
            "status": "error",
            "message": "Please send the record data as JSON."
        }, 400

    # ------------------------------------------------------
    # NEVER allow normal users to change admin-controlled
    # fields.
    # ------------------------------------------------------

    data.pop("status", None)
    data.pop("approval_required", None)
    data.pop("approval_message", None)
    data.pop("id", None)
    data.pop("record_key", None)
    data.pop("record_hash", None)
    data.pop("user_id", None)
    data.pop("created_at", None)
    data.pop("updated_at", None)
    data.pop("files", None)

    try:
        if record_type == "hire":

            hire = HireRequirement.query.filter_by(
                id=record_id,
                user_id=user_id
            ).first()

            if not hire:
                return {
                    "status": "error",
                    "message": "Hire record not found."
                }, 404

            new_title = clean_value(
                data.get("title")
            )
            new_description = clean_value(
                data.get("description")
            )
            new_scope = clean_value(
                data.get("scope")
            )

            new_hash = build_record_hash(
                user_id,
                new_title,
                new_description,
                new_scope
            )

            duplicate = get_hire_duplicate(
                user_id,
                new_hash,
                current_id=hire.id
            )

            if duplicate:
                return {
                    "status": "error",
                    "message": (
                        "Duplicate entry. You have already "
                        "submitted this Hire requirement: "
                        f"'{duplicate.title}'. Please change "
                        "the Title, Description, or Scope "
                        "before submitting again."
                    )
                }, 409

            update_hire_from_data(
                hire,
                data
            )

            # Preserve the existing admin-controlled status.
            hire.record_hash = new_hash

            db.session.commit()

            return {
                "status": "success",
                "message": "Hire record updated successfully.",
                "record_id": hire.id
            }, 200

        if record_type == "deliver":

            deliver = DeliverProposal.query.filter_by(
                id=record_id,
                user_id=user_id
            ).first()

            if not deliver:
                return {
                    "status": "error",
                    "message": "Deliver record not found."
                }, 404

            new_title = clean_value(
                data.get("title")
            )
            new_description = clean_value(
                data.get("description")
            )
            new_scope = clean_value(
                data.get("scope")
            )

            new_hash = build_record_hash(
                user_id,
                new_title,
                new_description,
                new_scope
            )

            duplicate = get_deliver_duplicate(
                user_id,
                new_hash,
                current_id=deliver.id
            )

            if duplicate:
                return {
                    "status": "error",
                    "message": (
                        "Duplicate entry. You have already "
                        "submitted this Deliver record: "
                        f"'{duplicate.title}'. Please change "
                        "the Title, Description, or Scope "
                        "before submitting again."
                    )
                }, 409

            update_deliver_from_data(
                deliver,
                data
            )

            # If teamMembers was supplied, replace the
            # existing team-member list with the new list.
            if (
                "teamMembers" in data
                or "team_members" in data
            ):
                team_members = parse_team_members(
                    get_value(
                        data,
                        "teamMembers",
                        "team_members"
                    )
                )

                delete_deliver_team_members(
                    deliver.id
                )

                db.session.flush()

                add_deliver_team_members(
                    deliver.id,
                    team_members
                )

            # Preserve the existing admin-controlled status.
            deliver.record_hash = new_hash

            db.session.commit()

            return {
                "status": "success",
                "message": "Deliver record updated successfully.",
                "record_id": deliver.id
            }, 200

        return {
            "status": "error",
            "message": "Invalid record type."
        }, 400

    except ValueError as exc:
        db.session.rollback()

        return {
            "status": "error",
            "message": str(exc)
        }, 400

    except Exception as exc:
        db.session.rollback()

        return {
            "status": "error",
            "message": "Unable to update record.",
            "detail": str(exc)
        }, 500


# =========================================================
# USER IMPORT
# =========================================================

@dashboard_bp.route(
    "/import/<record_type>",
    methods=["POST"]
)
@jwt_required_custom
def import_user_records(record_type):

    user_id = get_current_user_id()

    if not user_id:
        return {
            "status": "error",
            "message": "User dashboard is only available for normal users"
        }, 403

    if record_type not in ["hire", "deliver"]:
        return {
            "status": "error",
            "message": "Invalid import type."
        }, 400

    uploaded_file = request.files.get("file")

    if not uploaded_file:
        return {
            "status": "error",
            "message": "Please select an Excel or CSV file."
        }, 400

    try:
        rows = read_import_rows(
            uploaded_file
        )

        if not rows:
            return {
                "status": "error",
                "message": "The selected file contains no data rows."
            }, 400

        # --------------------------------------------------
        # Validate all rows first.
        # This prevents half-imported files.
        # --------------------------------------------------

        prepared = []

        for row_number, row in enumerate(
            rows,
            start=2
        ):
            try:
                if record_type == "hire":
                    prepared.append(
                        ("hire", row)
                    )
                else:
                    prepared.append(
                        ("deliver", row)
                    )

                validation_error = validate_required(
                    row,
                    record_type
                )

                if validation_error:
                    raise ValueError(
                        f"Row {row_number}: "
                        f"{validation_error}"
                    )

                # Check duplicate against DB and also
                # against earlier rows in the same file.
                title = clean_value(
                    row.get("title")
                )
                description = clean_value(
                    row.get("description")
                )
                scope = clean_value(
                    row.get("scope")
                )

                row_hash = build_record_hash(
                    user_id,
                    title,
                    description,
                    scope
                )

                if record_type == "hire":
                    existing = get_hire_duplicate(
                        user_id,
                        row_hash
                    )
                else:
                    existing = get_deliver_duplicate(
                        user_id,
                        row_hash
                    )

                if existing:
                    raise ValueError(
                        f"Row {row_number}: Duplicate entry. "
                        f"You have already submitted this "
                        f"{record_type.title()} record: "
                        f"'{existing.title}'. Please change "
                        "the Title, Description, or Scope "
                        "before importing again."
                    )

                if any(
                    item[0] == record_type
                    and item[1] == row_hash
                    for item in [
                        (
                            item_type,
                            build_record_hash(
                                user_id,
                                item_row.get("title"),
                                item_row.get("description"),
                                item_row.get("scope")
                            )
                        )
                        for item_type, item_row in prepared[:-1]
                    ]
                ):
                    raise ValueError(
                        f"Row {row_number}: Duplicate entry "
                        "inside the import file. Please "
                        "change the Title, Description, or Scope."
                    )

                if record_type == "deliver":
                    parse_amount(
                        row.get("amount")
                    )

                    parse_team_members(
                        get_value(
                            row,
                            "teamMembers",
                            "team_members"
                        )
                    )

            except ValueError:
                raise
            except Exception as exc:
                raise ValueError(
                    f"Row {row_number}: {str(exc)}"
                )

        # --------------------------------------------------
        # Create all records.
        # --------------------------------------------------

        imported_records = []

        for _, row in prepared:
            if record_type == "hire":
                record = create_hire_from_data(
                    user_id,
                    row
                )
            else:
                record = create_deliver_from_data(
                    user_id,
                    row
                )

            imported_records.append(
                record
            )

        db.session.commit()

        return {
            "status": "success",
            "message": (
                f"{len(imported_records)} "
                f"{record_type.title()} record(s) "
                "imported successfully. "
                "All imported records are waiting for Admin Approval."
            ),
            "imported_count": len(imported_records),
            "record_ids": [
                record.id
                for record in imported_records
            ]
        }, 201

    except ValueError as exc:
        db.session.rollback()

        return {
            "status": "error",
            "message": str(exc)
        }, 400

    except Exception as exc:
        db.session.rollback()

        return {
            "status": "error",
            "message": (
                "Import failed. No records were imported."
            ),
            "detail": str(exc)
        }, 500

