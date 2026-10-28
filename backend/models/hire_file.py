from extensions import db


class HireFile(db.Model):
    __tablename__ = "hire_files"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    hire_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "hire_requirements.id",
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