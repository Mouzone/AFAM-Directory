// fireside.js
import admin = require('firebase-admin');

export function initializeFirebaseAdmin() {
    const serviceAccount = require('../afam-directory-firebase-adminsdk-fbsvc-c6f23bf9b8.json');
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}