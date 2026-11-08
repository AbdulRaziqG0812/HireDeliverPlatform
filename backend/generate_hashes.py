import hashlib

from app import app
from extensions import db
from models.deliver_proposal import DeliverProposal


def make_hash(proposal):
    duplicate_string = "|".join([
        str(proposal.user_id),
        (proposal.title or "").strip().lower(),
        (proposal.description or "").strip().lower(),
        (proposal.scope or "").strip().lower(),
    ])

    return hashlib.sha256(
        duplicate_string.encode("utf-8")
    ).hexdigest()


with app.app_context():

    proposals = DeliverProposal.query.all()

    for proposal in proposals:
        proposal.record_hash = make_hash(proposal)

        print(
            proposal.id,
            proposal.record_key,
            proposal.record_hash
        )

    db.session.commit()

    print("\nAll Deliver record hashes generated successfully.")