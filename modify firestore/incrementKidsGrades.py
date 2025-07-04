import firebase_admin
from firebase_admin import firestore

## fetch all kids
def incrementKidsGrades():
    firebase_admin.initialize_app()
    db = firestore.client()
    try:
        collection = "directory/afam/student"
        collection_ref = db.collection(collection)
        docs = collection_ref.get()
        documents_to_move = list(docs)
        
        batch = db.batch()
        for doc_snap in documents_to_move:
            general_data = doc_snap.to_dict()
            original_doc_ref = collection_ref.document(doc_snap.id)

            try:
                general_data["Grade"] = general_data["Grade"] + 1
            except ValueError:
                general_data["Grade"] = 9

            batch.update(original_doc_ref, general_data)
        batch.commit()
    except Exception as e:
        print(f"An error occurred: {e}")

incrementKidsGrades()