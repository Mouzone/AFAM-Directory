import firebase_admin
from firebase_admin import firestore
from firebase_admin import auth

import random
import string

firebase_admin.initialize_app()
ROLES = ["pastor", "deacon", "welcome team leader", "teacher", "student"]


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
            user_doc_ref = db.document("organization", "roles", role, user.uid)
            user_doc_ref.set(
                {
                    "firstName": first_name,
                    "lastName": last_name,
                    "email": email,
                }
            )


# forgot to set auth local emulator, so have to remove all accounts from cloud
def delete_test_users():
    page = auth.list_users()
    while page:
        for user in page.users:
            if len(user.email) == 12:
                auth.delete_user(user.uid)
        page = page.get_next_page()


# delete_test_users()
add_test_users()
