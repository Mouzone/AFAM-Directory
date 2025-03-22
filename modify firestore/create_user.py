import os
import firebase_admin
from firebase_admin import auth
from dotenv import load_dotenv

firebase_admin.initialize_app()

load_dotenv()


def create_user():
    # create my admin account
    userRecord = auth.create_user(
        email=os.getenv("EMAIL"), password=os.getenv("PASSWORD")
    )
    # add admin claim
    auth.set_custom_user_claims(userRecord.uid, {"role": os.getenv("ROLE")})


create_user()
