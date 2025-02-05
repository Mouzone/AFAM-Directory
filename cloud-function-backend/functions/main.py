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

@https_fn.on_request(cors=options.CorsOptions(cors_origins="*", cors_methods=["GET"]))
def getCollection(req: https_fn.Request) -> https_fn.Response:
    try:
        # Get the 'type' query parameter
        collection_type = req.args.get("type")
        if not collection_type:
            return jsonify({"error": "Missing 'type' parameter"}), 400

        # Fetch documents from Firestore
        documents = fireStore_client.collection(collection_type).stream()
        entries = []
        for document in documents:
            entry = document.to_dict()
            entry["id"] = document.id
            entries.append(entry)

        # Return the response as JSON
        return jsonify(entries), 200

    except Exception as e:
        print(f"Error fetching documents: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@https_fn.on_request(cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]))
def createStudent(req: https_fn.Request) -> https_fn.Response:
    # middleware_response = check_token(req)
    # if middleware_response:
    #     return middleware_response

    try:
        if not req.data:
            return jsonify({"error": "Request body is empty"}), 400

        request_data = req.get_json()

        if not request_data:
            return jsonify({"error": "Invalid JSON"}), 400

        firstName = request_data.get("firstName")
        lastName = request_data.get("lastName")
        schoolYear = request_data.get("schoolYear")
        dob = request_data.get("dob")
        gender = request_data.get("gender")
        highSchool = request_data.get("highSchool")
        home = request_data.get("home")
        phoneNumber = request_data.get("phoneNumber")
        email = request_data.get("email")
        allergies = request_data.get("allergies")
        primaryContact = request_data.get("primaryContact")
        teacher = request_data.get("teacher")
        
        doc_ref = fireStore_client.collection("students").document()
        doc_ref.set({
            "firstName": firstName,
            "lastName": lastName,
            "schoolYear": schoolYear,
            "dob": dob,
            "gender": gender,
            "highSchool": highSchool,
            "phoneNumber": phoneNumber,
            "email": email,
            "allergies": allergies,
            "home": home,
            "primaryContact": primaryContact,
            "teacher": teacher
        })

        return jsonify({"message": "Data processed successfully", "id": doc_ref.id}), 200

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@https_fn.on_request(cors=options.CorsOptions(cors_origins="*", cors_methods=["PUT"]))
def editStudent(req: https_fn.Request) -> https_fn.Response:

    # middleware_response = check_token(req)
    # if middleware_response:
    #     return middleware_response

    try:
        if not req.data:
            return jsonify({"error": "Request body is empty"}), 400

        request_data = req.get_json()

        if not request_data:
            return jsonify({"error": "Invalid JSON"}), 400

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