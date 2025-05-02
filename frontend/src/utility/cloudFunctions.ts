import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export const createDirectory = httpsCallable(functions, "createDirectory");
export const inviteStaff = httpsCallable(functions, "inviteStaff");
