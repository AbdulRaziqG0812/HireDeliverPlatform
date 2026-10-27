from extensions import db


class DeliverTeamMember(db.Model):
    __tablename__ = "deliver_team_members"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    deliver_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "deliver_proposals.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    role = db.Column(
        db.String(150),
        nullable=False
    )

    skills = db.Column(
        db.Text
    )

    experience = db.Column(
        db.Integer
    )

    profile = db.Column(
        db.String(500)
    )

    similar_experience = db.Column(
        db.String(255)
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )