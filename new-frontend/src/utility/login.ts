import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

type LoginInputs = {
    email: string;
    password: string;
};
export const login = ({ email, password }: LoginInputs) => {
    return signInWithEmailAndPassword(auth, email, password);
};
