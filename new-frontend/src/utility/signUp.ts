import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

type SignUpInputs = {
    email: string;
    password: string;
};

export const signUp = ({ email, password }: SignUpInputs) => {
    return createUserWithEmailAndPassword(auth, email, password);
};
