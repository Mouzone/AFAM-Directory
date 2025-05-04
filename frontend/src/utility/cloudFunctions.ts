import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export const inviteStaff = httpsCallable(functions, "inviteStaff");
export const deleteStudent = httpsCallable(functions, "deleteStudent");
