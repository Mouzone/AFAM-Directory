import csv
import firebase_admin
from firebase_admin import firestore

# Replace with your Firebase project credentials
COLLECTION_NAME = "directory/afam/student"  # The Firestore collection to store data in
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
                if row["First Name"] == "":
                    break
                general_doc_ref = (
                    collection_ref.document()
                )  # Auto-generate document IDs

                # Convert all values to appropriate types.  Critical for Firestore!
                general_info = {}
                private_info = {}
                general_info["First Name"] = row["First Name"].strip()
                general_info["Last Name"] = row["Last Name"].strip()
                general_info["Grade"] = row["Grade"].strip()

                # to go from 1/17/2009 to Timestamp
                dob_parts = row["Date of Birth (DOB)"].split("/")
                general_info["Birthday"] = (
                    f"20{dob_parts[2]}-{dob_parts[0].zfill(2)}-{dob_parts[1].zfill(2)}"
                )

                if row["Allergies"] == "":
                    general_info["Allergies"] = []
                else:
                    general_info["Allergies"] = [
                        allergy.strip().lower()
                        for allergy in row.get("Allergies", "").split(",")
                    ]
                general_info["Gender"] = row["Gender"].strip()[0]
                general_info["High School"] = row["High School"].strip()

                # from 10A Sunny Liu to {Sunny, Liu}
                teacher_parts = row["Small Group Class"].split(" ")
                if len(teacher_parts) == 3:
                    general_info["Teacher"] = (
                        f"{teacher_parts[1].strip()} {teacher_parts[2].strip()}"
                    )
                else:
                    general_info["Teacher"] = "None"
                private_info["Personal"] = {
                    "Email": row["Personal Email Address"].strip(),
                    "Phone Number": row["Personal Phone Number"].strip(),
                    "City": row["City"].strip(),
                    "Street Address": row["Street Address"].strip(),
                    "Zip Code": row["Postal Code"].strip(),
                }

                private_info["Guardian 1"] = {
                    "First Name": row["Parent 1 First Name"].strip(),
                    "Last Name": row["Parent 1 Last Name"].strip(),
                    "Phone": row["Parent 1 Phone Number"].strip(),
                    "Email": row["Parent 1 Email Address"].strip(),
                }
                private_info["Guardian 2"] = {
                    "First Name": row["Parent 2 First Name"].strip(),
                    "Last Name": row["Parent 2 Last Name"].strip(),
                    "Phone": row["Parent 2 Phone Number"].strip(),
                    "Email": row["Parent 2 Email Address"].strip(),
                }

                batch.set(general_doc_ref, general_info)
                private_doc_ref = (
                    collection_ref.document(general_doc_ref.id)
                    .collection("private")
                    .document("data")
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
