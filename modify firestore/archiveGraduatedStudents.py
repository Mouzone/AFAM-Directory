import firebase_admin
from firebase_admin import firestore
from datetime import datetime

def archiveGraduatedStudents():
    firebase_admin.initialize_app()
    db = firestore.client()

    try:
        origin_collection = "directory/afam/student"
        destination_collection = f"directory/afam/archive/student/{datetime.now().year}"
        origin_collection_ref = db.collection(origin_collection)
        destination_collection_ref = db.collection(destination_collection)

        # select all that are grade 12
        query_ref = origin_collection_ref.where("Grade", "==", "12")
        docs = query_ref.stream()
        documents_to_move = list(docs)

        if not documents_to_move:
            print("No students with Grade 12 found to move.")
            return

        batch = db.batch()
        moved_count = 0

        for doc_snap in documents_to_move:
            general_data = doc_snap.to_dict()

            original_doc_ref = origin_collection_ref.document(doc_snap.id)
            private_doc_ref = original_doc_ref.collection("private").document("data")
            
            private_data = private_doc_ref.get().to_dict()

            new_doc_ref = destination_collection_ref.document(doc_snap.id) # Keep same ID
            new_private_doc_ref = new_doc_ref.collection("private").document("data")
            
            # Add operation to set the document in the new collection
            batch.set(new_doc_ref, general_data)
            batch.set(new_private_doc_ref, private_data)

            # Add operation to delete the document from the original collection
            batch.delete(private_doc_ref)
            batch.delete(original_doc_ref)
            moved_count += 1

        # Commit the batch operations
        batch.commit()
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the Firestore client (good practice)
        if firebase_admin._apps:  # Only close if initialized.
            db.close()

archiveGraduatedStudents()