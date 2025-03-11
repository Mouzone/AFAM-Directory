import firebase_admin
from firebase_admin import auth

firebase_admin.initialize_app()


# forgot to set auth local emulator, so have to remove all accounts from cloud
def delete_test_users():
    page = auth.list_users()
    while page:
        for user in page.users:
            if len(user.email) == 12:
                auth.delete_user(user.uid)
        page = page.get_next_page()


delete_test_users()
