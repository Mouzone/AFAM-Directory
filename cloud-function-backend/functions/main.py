from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore, auth
from flask import jsonify
import google.cloud.firestore

# Initialize Firebase Admin SDK
app = initialize_app()
fireStore_client: google.cloud.firestore.Client = firestore.client()

@https_fn.on_call()
def getStudents(req: https_fn.CallableRequest) -> https_fn.Response:  # Use CallableRequest
    if not req.auth:  # Essential check for authentication
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Fetch documents from Firestore (unchanged)
        documents = fireStore_client.collection("students").stream()
        entries = []
        for document in documents:
            entry = document.to_dict()
            entry["id"] = document.id
            entries.append(entry)

        return jsonify(entries), 200

    except Exception as e:
        print(f"Error fetching documents: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@https_fn.on_call()
def getTeachers(req: https_fn.CallableRequest) -> https_fn.Response:  # Use CallableRequest
    if not req.auth:  # Essential check for authentication
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Fetch documents from Firestore (unchanged)
        documents = fireStore_client.collection("teachers").stream()
        entries = []
        for document in documents:
            entry = document.to_dict()
            entry["id"] = document.id
            entries.append(entry)

        return jsonify(entries), 200

    except Exception as e:
        print(f"Error fetching documents: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@https_fn.on_call()
def createStudent(req: https_fn.CallableRequest) -> https_fn.Response: # Use CallableRequest
    if not req.auth:  # Essential check for authentication
        return jsonify({"error": "Unauthorized"}), 401

    try:
        request_data = req.data # Access data directly from req.data

        if not request_data:
            return jsonify({"error": "Request body is empty"}), 400

        doc_ref = fireStore_client.collection("students").document()
        doc_ref.set(request_data)

        return jsonify({"message": "Data processed successfully", "id": doc_ref.id}), 200

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@https_fn.on_call()
def editStudent(req: https_fn.CallableRequest) -> https_fn.Response: # Use CallableRequest
    if not req.auth:  # Essential check for authentication
        return jsonify({"error": "Unauthorized"}), 401
    try:
        request_data = req.data # Access data directly from req.data

        if not request_data:
            return jsonify({"error": "Request body is empty"}), 400

        document_id = request_data.get("id")
        if not document_id:
            return jsonify({"error": "Missing 'id' field"}), 400

        doc_ref = fireStore_client.collection("students").document(document_id)

        if not doc_ref.get().exists:
            return jsonify({"error": "Document does not exist"}), 404

        update_data = {k: v for k, v in request_data.items() if k != "id"}
        doc_ref.update(update_data)

        return jsonify({"message": "Document updated successfully", "id": document_id}), 200

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Internal Server Error"}), 500