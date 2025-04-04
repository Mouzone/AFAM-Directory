import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

type SignUpInputs = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
};

export const signUp = ({
    firstName,
    lastName,
    username,
    email,
    password,
}: SignUpInputs) => {
    return signInWithEmailAndPassword(auth, email, password);
};
