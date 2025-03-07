# probably best to create a csv with info
# all of them is just firstName, lastName, email, password, role
# create the user in auth
# fetch the uid
# insert into organization > roles > {role}
## document name is uid and add lastName, firstName, email to the doc
import firebase_admin
from firebase_admin import firestore
from firebase_admin import auth

import random
import string

import firebase_admin.auth

ROLES = ["pastor", "deacon", "welcome team leader", "teacher", "student"]


def add_test_users(csv_file_path):
    firebase_admin.initialize_app()
    db = firestore.client()

    organization_ref = db.collection("organization")
    document_ref = organization_ref.document("roles")
    seen_names = set()
    for role in ROLES:
        for i in range(20):
            # randomize two characters, compare it in set
            # use the two characters as email
            # create account
            # create document
            firstLetter = random.choice(string.ascii_letters)
            secondLetter = random.choice(string.ascii_letters)

            while (firstLetter, secondLetter) in seen_names:
                firstLetter = random.choice(string.ascii_letters)
                secondLetter = random.choice(string.ascii_letters)

            firstName = firstLetter
            lastName = secondLetter
            email = "{firstLetter}@{secondLetter}"
            password = "123456"

            firebase_admin.auth.create_user()
