# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore
import google.cloud.firestore

app = initialize_app()

@https_fn.on_request(cors=options.CorsOpions(cors_methods=["GET"]))
def getCollection(req: https_fn.Request) -> https_fn.Response:
    try:
        collection_type = req.args.get("type")
        if  not collection_type:
            return https_fn.Response("Missing 'type' parameter", status=400)
        
        fireStore_client: google.cloud.firestore.Client = firestore.client()

        values = fireStore_client.collections(f"{type}").stream()
        entries = []
        for value in values:
            entry = value.to_dict()
            entry["id"] = value.id
            entries.append(entry)

        return https_fn.Response(values, status=200, content_type="application/json")
    
    except Exception as e:
        print(f"Error fetching documents: {e}")
        return https_fn.Response("Internal Server Error", status=500)

@https_fn.on_request(cors=options.CorsOptions(cors_methods=["POST", "PUT"]))
def createStudent(req: https_fn.Request) -> https_fn.Response:
    
# Routes:
## Create Student / Edit Student
### can combine since both send the same payload, of a ton of data
 
# Middleware:
## Check auth (maybe header?)