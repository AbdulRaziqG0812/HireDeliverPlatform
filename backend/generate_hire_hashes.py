import hashlib

from app import app
from extensions import db
from models.hire_requirement import HireRequirement


def make_hash(requirement):
    duplicate_string = "|".join([
        str(requirement.user_id),
        (requirement.title or "").strip().lower(),
        (requirement.description or "").strip().lower(),
        (requirement.scope or "").strip().lower(),
    ])

    return hashlib.sha256(
        duplicate_string.encode("utf-8")
    ).hexdigest()


with app.app_context():

    requirements = HireRequirement.query.all()

    hashes = {}

    for requirement in requirements:

        requirement.record_hash = make_hash(
            requirement
        )

        print(
            requirement.id,
            requirement.record_key,
            requirement.record_hash
        )

        if requirement.record_hash in hashes:

            print(
                "DUPLICATE HASH:",
                requirement.id,
                hashes[requirement.record_hash]
            )

        else:

            hashes[requirement.record_hash] = requirement.id

    db.session.commit()

    print("\nAll Hire record hashes generated successfully.")