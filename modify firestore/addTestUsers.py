import firebase_admin
from firebase_admin import firestore
from firebase_admin import auth

import random
import string

firebase_admin.initialize_app()
ROLES = ["pastor", "deacon", "teacher", "student"]


def add_test_users():
    db = firestore.client()

    seen_names = set()
    for role in ROLES:
        for i in range(20):
            first_letter = random.choice(string.ascii_lowercase)
            second_letter = random.choice(string.ascii_lowercase)

            while (first_letter, second_letter) in seen_names:
                first_letter = random.choice(string.ascii_lowercase)
                second_letter = random.choice(string.ascii_lowercase)

            seen_names.add((first_letter, second_letter))

            first_name = first_letter
            last_name = second_letter
            email = f"{first_letter}{second_letter}@gmail.com"
            password = "123456"

            user = auth.create_user(email=email, password=password)
            custom_claims = {"role": role}
            user_data = {
                "firstName": first_name,
                "lastName": last_name,
                "email": email,
            }
            if role == "teacher" or role == "deacon":
                custom_claims["isWelcomeTeamLeader"] = False
                user_data["isWelcomeTeamLeader"] = False

            auth.set_custom_user_claims(user.uid, custom_claims)
            user_doc_ref = db.document("organization", "roles", role, user.uid)
            user_doc_ref.set(user_data)


add_test_users()
