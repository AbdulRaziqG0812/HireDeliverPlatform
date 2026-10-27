from extensions import db


class DeliverProposal(db.Model):
    __tablename__ = "deliver_proposals"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    country = db.Column(
        db.String(100),
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
        db.Text,
        nullable=False
    )

    deliverables = db.Column(
        db.Text,
        nullable=False
    )

    currency = db.Column(
        db.String(10),
        nullable=False,
        default="PKR"
    )

    amount = db.Column(
        db.Numeric(15, 2),
        nullable=False
    )

    included_cost = db.Column(
        db.Text,
        nullable=False
    )

    excluded_cost = db.Column(
        db.Text
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

    available_resources = db.Column(
        db.Text,
        nullable=False
    )

    required_resources = db.Column(
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

    city = db.Column(
        db.String(100),
        nullable=False
    )

    full_location = db.Column(
        db.Text
    )

    portfolio = db.Column(
        db.String(500)
    )

    notification_period = db.Column(
        db.String(100)
    )

    notification_details = db.Column(
        db.Text
    )

    communication_method = db.Column(
        db.String(100),
        nullable=False
    )

    communication_details = db.Column(
        db.String(255)
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