import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

if (window.location.hostname === "localhost") { // Check if running locally
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    connectFirestoreEmulator(db, 'localhost', 8080); // Connect to the emulator
}

export { app, auth, db };