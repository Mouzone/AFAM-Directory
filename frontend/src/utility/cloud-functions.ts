import { functions } from "./firebase";
import { httpsCallable } from "firebase/functions";

export const createUserWithRole = httpsCallable(functions, 'createUserWithRole');
export const generateInviteLink = httpsCallable(functions, "generateInviteLink");