from extensions import db


class DeliverFile(db.Model):
    __tablename__ = "deliver_files"

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

    original_name = db.Column(
        db.String(255),
        nullable=False
    )

    stored_name = db.Column(
        db.String(255),
        nullable=False
    )

    file_path = db.Column(
        db.String(500),
        nullable=False
    )

    file_type = db.Column(
        db.String(100)
    )

    file_size = db.Column(
        db.BigInteger
    )

    uploaded_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )