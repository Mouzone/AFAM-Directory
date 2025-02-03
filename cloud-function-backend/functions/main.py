from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore, auth
from flask import jsonify
import google.cloud.firestore

# Initialize Firebase Admin SDK
app = initialize_app()
fireStore_client: google.cloud.firestore.Client = firestore.client()

# Middleware to check Bearer Token
def check_token(req: https_fn.Request) -> https_fn.Response | None:
    # Check for Authorization header
    auth_header = req.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return https_fn.Response(jsonify({"error": "Unauthorized: Missing or invalid Authorization header"}), status=401)

    # Extract the token
    id_token = auth_header.split("Bearer ")[1]

    try:
        # Verify the token
        decoded_token = auth.verify_id_token(id_token)
        req.user = decoded_token  # Attach user info to the request object
        return None  # Proceed to the route
    except Exception as e:
        return https_fn.Response(jsonify({"error": "Unauthorized: Invalid or expired token", "details": str(e)}), status=401)

@https_fn.on_request(cors=options.CorsOptions(cors_methods=["GET"]))
def getCollection(req: https_fn.Request) -> https_fn.Response:
    middleware_response = check_token(req)
    if middleware_response:
        return middleware_response

    try:
        collection_type = req.args.get("type")
        if not collection_type:
            return https_fn.Response("Missing 'type' parameter", status=400)

        documents = fireStore_client.collection(collection_type).stream()
        entries = []
        for document in documents:
            entry = document.to_dict()
            entry["id"] = document.id
            entries.append(entry)

        return https_fn.Response(jsonify(entries), status=200, content_type="application/json")

    except Exception as e:
        print(f"Error fetching documents: {e}")
        return https_fn.Response(jsonify({"error": "Internal Server Error"}), status=500)

@https_fn.on_request(cors=options.CorsOptions(cors_methods=["POST"]))
def createStudent(req: https_fn.Request) -> https_fn.Response:
    middleware_response = check_token(req)
    if middleware_response:
        return middleware_response

    try:
        if not req.data:
            return https_fn.Response(jsonify({"error": "Request body is empty"}), status=400)

        request_data = req.get_json()

        if not request_data:
            return https_fn.Response(jsonify({"error": "Invalid JSON"}), status=400)

        name = request_data.get("name")
        age = request_data.get("age")

        if not name or not age:
            return https_fn.Response(jsonify({"error": "Missing required fields"}), status=400)

        doc_ref = fireStore_client.collection("students").document()
        doc_ref.set({
            "name": name,
            "age": age
        })

        return https_fn.Response(jsonify({"message": "Data processed successfully", "id": doc_ref.id}), status=200)

    except Exception as e:
        print(f"Error processing request: {e}")
        return https_fn.Response(jsonify({"error": "Internal Server Error"}), status=500)

@https_fn.on_request(cors=options.CorsOptions(cors_methods=["PUT"]))
def editStudent(req: https_fn.Request) -> https_fn.Response:

    middleware_response = check_token(req)
    if middleware_response:
        return middleware_response

    try:
        if not req.data:
            return https_fn.Response(jsonify({"error": "Request body is empty"}), status=400)

        request_data = req.get_json()

        if not request_data:
            return https_fn.Response(jsonify({"error": "Invalid JSON"}), status=400)

        document_id = request_data.get("document_id")
        if not document_id:
            return https_fn.Response(jsonify({"error": "Missing 'document_id' field"}), status=400)

        doc_ref = fireStore_client.collection("students").document(document_id)

        if not doc_ref.get().exists:
            return https_fn.Response(jsonify({"error": "Document does not exist"}), status=404)

        update_data = {k: v for k, v in request_data.items() if k != "document_id"}
        doc_ref.update(update_data)

        return https_fn.Response(jsonify({"message": "Document updated successfully", "id": document_id}), status=200)

    except Exception as e:
        print(f"Error processing request: {e}")
        return https_fn.Response(jsonify({"error": "Internal Server Error"}), status=500)