from extensions import db


class HireRequirement(db.Model):
    __tablename__ = "hire_requirements"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    title = db.Column(
        db.String(255),
        nullable=False
    )

    type = db.Column(
        db.String(100),
        nullable=False
    )

    category = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    scope = db.Column(
        db.Text
    )

    deliverables = db.Column(
        db.Text
    )

    budget = db.Column(
        db.String(255),
        nullable=False
    )

    processing = db.Column(
        db.String(100),
        nullable=False
    )

    standard_timeline = db.Column(
        db.String(100),
        nullable=False
    )

    urgent_timeline = db.Column(
        db.String(100)
    )

    human_resources = db.Column(
        db.Text
    )

    roles = db.Column(
        db.Text
    )

    skills = db.Column(
        db.Text
    )

    tools = db.Column(
        db.Text
    )

    physical_resources = db.Column(
        db.Text
    )

    additional_resources = db.Column(
        db.Text
    )

    location = db.Column(
        db.String(100),
        nullable=False
    )

    full_location = db.Column(
        db.Text
    )

    communication_method = db.Column(
        db.String(100),
        nullable=False
    )

    notification_period = db.Column(
        db.String(100)
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )