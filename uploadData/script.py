import csv
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Replace with your Firebase project credentials
CREDENTIALS_PATH = "/Users/sunnyliu/Repos/AFAM-Directory/backend/server/afam-directory-firebase-adminsdk-fbsvc-c6f23bf9b8.json"  # e.g., "serviceAccountKey.json"
COLLECTION_NAME = "students"  # The Firestore collection to store data in
BATCH_SIZE = 500  # Adjust batch size as needed; 500-1000 is usually a good starting point

def csv_to_firestore(csv_file_path, collection_name, batch_size):
    """Reads CSV data and writes it to Firestore in batches."""

    try:
        # Initialize Firebase Admin SDK if not already initialized
        if not firebase_admin._apps:  # Check if already initialized. Important for multiple calls
            cred = credentials.Certificate(CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)

        db = firestore.client()
        collection_ref = db.collection(collection_name)
        with open(csv_file_path, 'r', encoding='utf-8') as csvfile:  # Handle potential encoding issues
            reader = csv.DictReader(csvfile)  # Assumes first row is header

            batch_count = 0
            batch = db.batch()

            for i, row in enumerate(reader):
                doc_ref = collection_ref.document()  # Auto-generate document IDs

                # Convert all values to appropriate types.  Critical for Firestore!
                converted_row = {}
                converted_row["firstName"] = row["First Name"]
                converted_row["lastName"] = row["Last Name"]
                converted_row["schoolYear"] = row["Grade"]
                # to go from 1/17/2009 to 2025-02-28
                dob_parts = row["Date of Birth (DOB)"].split("/")
                converted_row["dob"] = f"{dob_parts[2]}-{dob_parts[0]}-{dob_parts[1]}" 

                converted_row["allergies"] = row["Allergies"].split(",")
                converted_row["email"] = row["Personal Email Address"]
                converted_row["phoneNumber"] = row["Personal Phone Number"]
                converted_row["gender"] = row["Gender"]
                converted_row["highSchool"] = row["High School"]
                converted_row["home"] = {
                    "city": row["City"],
                    "streetAddress": row["Street Address"],
                    "zipCode": row["Postal Code"]
                }
                # figure out if we need both parents, or just one guardian
                converted_row["Guardian 1"] = {
                    "email": row["Parent 1 Email Address"],
                    "firstName": row["Parent 1 First Name"],
                    "lastName": row["Parent 1 Last Name"],
                    "phoneNumber": row["Parent 1 Phone Number"]
                }
                converted_row["Guardian 2"] = {
                    "email": row["Parent 2 Email Address"],
                    "firstName": row["Parent 2 First Name"],
                    "lastName": row["Parent 2 Last Name"],
                    "phoneNumber": row["Parent 2 Phone Number"]
                }
                # from 10A Sunny Liu to {Sunny, Liu}
                teacher_parts = row["Small Group Class"].split(" ")
                converted_row["teacher"] = {
                    "firstName": teacher_parts[0],
                    "lastName": teacher_parts[1]
                }

                batch.set(doc_ref, converted_row)

                batch_count += 1

                if batch_count == batch_size:
                    batch.commit()
                    batch = db.batch()  # Start a new batch
                    batch_count = 0
                    print(f"Batch {i // batch_size + 1} committed.")  # Progress indicator

            # Commit any remaining documents in the last batch
            if batch_count > 0:
                batch.commit()
                print("Last batch committed.")

            print(f"Successfully imported {i + 1} documents to Firestore.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the Firestore client (good practice)
        if firebase_admin._apps: # Only close if initialized.
            db.close()

# Example usage:
csv_file_path = "/Users/sunnyliu/Desktop/2025 AFAM Student Information (Responses) - Cleaned Up.csv"
csv_to_firestore(csv_file_path, COLLECTION_NAME, BATCH_SIZE)