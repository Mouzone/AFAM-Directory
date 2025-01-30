import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccount = require("../afam-directory-firebase-adminsdk-fbsvc-c6f23bf9b8.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export default admin