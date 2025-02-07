from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore, auth
import google.cloud.firestore

# Initialize Firebase Admin SDK
app = initialize_app()
fireStore_client: google.cloud.firestore.Client = firestore.client()

@https_fn.on_call()
def createStudent(req: https_fn.CallableRequest) -> https_fn.Response: # Use CallableRequest
    if not req.auth:  # Essential check for authentication
        return {"error": "Unauthorized"}

    try:
        request_data = req.data # Access data directly from req.data

        if not request_data:
            return {"error": "Request body is empty"}

        doc_ref = fireStore_client.collection("students").document()
        doc_ref.set(request_data)

        return {"message": "Data processed successfully", "id": doc_ref.id}

    except Exception as e:
        print(f"Error processing request: {e}")
        return {"error": "Internal Server Error"}


@https_fn.on_call()
def editStudent(req: https_fn.CallableRequest) -> https_fn.Response: # Use CallableRequest
    if not req.auth:  # Essential check for authentication
        return {"error": "Unauthorized"}
    try:
        request_data = req.data # Access data directly from req.data

        if not request_data:
            return {"error": "Request body is empty"}

        document_id = request_data.get("id")
        if not document_id:
            return {"error": "Missing 'id' field"}

        doc_ref = fireStore_client.collection("students").document(document_id)

        if not doc_ref.get().exists:
            return {"error": "Document does not exist"}

        update_data = {k: v for k, v in request_data.items() if k != "id"}
        doc_ref.update(update_data)

        return {"message": "Document updated successfully", "id": document_id}

    except Exception as e:
        print(f"Error processing request: {e}")
        return {"error": "Internal Server Error"}