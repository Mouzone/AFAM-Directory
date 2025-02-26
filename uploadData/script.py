import csv
import firebase_admin
from firebase_admin import firestore

# Replace with your Firebase project credentials
COLLECTION_NAME = "students"  # The Firestore collection to store data in
BATCH_SIZE = 500


def csv_to_firestore(csv_file_path, collection_name, batch_size):
    """Reads CSV data and writes it to Firestore in batches."""

    try:
        firebase_admin.initialize_app()
        db = firestore.client()
        collection_ref = db.collection(collection_name)
        dummy_doc_ref = collection_ref.document("dummy_document")
        dummy_doc_ref.set({"dummy_field": "dummy_value"})  # Add some dummy data

        with open(
            csv_file_path, "r", encoding="utf-8"
        ) as csvfile:  # Handle potential encoding issues
            reader = csv.DictReader(csvfile)  # Assumes first row is header

            batch_count = 0
            batch = db.batch()

            for i, row in enumerate(reader):
                print(row)
                if row["First Name"] == "":
                    break
                general_doc_ref = (
                    collection_ref.document()
                )  # Auto-generate document IDs

                # Convert all values to appropriate types.  Critical for Firestore!
                general_info = {}
                private_info = {}
                general_info["firstName"] = row["First Name"].strip()
                general_info["lastName"] = row["Last Name"].strip()
                general_info["schoolYear"] = row["Grade"].strip()

                # to go from 1/17/2009 to 2025-02-28
                dob_parts = row["Date of Birth (DOB)"].split("/")
                general_info["dob"] = (
                    f"20{dob_parts[2]}-{dob_parts[0].zfill(2)}-{dob_parts[1].zfill(2)}"
                )

                if row["Allergies"] == "":
                    general_info["allergies"] = []
                else:
                    general_info["allergies"] = [
                        allergy.strip().lower()
                        for allergy in row.get("Allergies", "").split(",")
                    ]
                general_info["gender"] = row["Gender"].strip()
                general_info["highSchool"] = row["High School"].strip()

                private_info["email"] = row["Personal Email Address"].strip()
                private_info["phoneNumber"] = row["Personal Phone Number"].strip()
                private_info["home"] = {
                    "city": row["City"].strip(),
                    "streetAddress": row["Street Address"].strip(),
                    "zipCode": row["Postal Code"].strip(),
                }

                private_info["guardian1"] = {
                    "email": row["Parent 1 Email Address"].strip(),
                    "firstName": row["Parent 1 First Name"].strip(),
                    "lastName": row["Parent 1 Last Name"].strip(),
                    "phoneNumber": row["Parent 1 Phone Number"].strip(),
                }
                private_info["guardian2"] = {
                    "email": row["Parent 2 Email Address"].strip(),
                    "firstName": row["Parent 2 First Name"].strip(),
                    "lastName": row["Parent 2 Last Name"].strip(),
                    "phoneNumber": row["Parent 2 Phone Number"].strip(),
                }
                # from 10A Sunny Liu to {Sunny, Liu}
                teacher_parts = row["Small Group Class"].split(" ")
                if len(teacher_parts) == 3:
                    general_info["teacher"] = {
                        "firstName": teacher_parts[1].strip(),
                        "lastName": teacher_parts[2].strip(),
                    }
                else:
                    general_info["teacher"] = {"firstName": "Unassigned"}

                batch.set(general_doc_ref, general_info)
                private_doc_ref = (
                    collection_ref.document(general_doc_ref.id)
                    .collection("private")
                    .document("privateInfo")
                )
                batch.set(private_doc_ref, private_info)
                batch_count += 1

                if batch_count == batch_size:
                    batch.commit()
                    batch = db.batch()  # Start a new batch
                    batch_count = 0
                    print(
                        f"Batch {i // batch_size + 1} committed."
                    )  # Progress indicator

            # Commit any remaining documents in the last batch
            if batch_count > 0:
                batch.commit()
                print("Last batch committed.")

            print(f"Successfully imported {i + 1} documents to Firestore.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the Firestore client (good practice)
        if firebase_admin._apps:  # Only close if initialized.
            dummy_doc_ref.delete()
            db.close()


# Example usage:
csv_file_path = (
    "/Users/sunnyliu/Desktop/2025 AFAM Student Information (Responses) - Cleaned Up.csv"
)
csv_to_firestore(csv_file_path, COLLECTION_NAME, BATCH_SIZE)
