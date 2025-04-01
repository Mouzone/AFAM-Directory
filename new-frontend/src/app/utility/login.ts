import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export const login = (credentials: { email: string; password: string }) => {
    return signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
    );
};
