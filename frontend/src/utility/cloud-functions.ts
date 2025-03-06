import { GenerateInviteResponse } from "@/types";
import { functions } from "./firebase";
import { httpsCallable } from "firebase/functions";

export const createUserWithRole = httpsCallable(functions, 'createUserWithRole');
export const generateInviteToken = httpsCallable<{ role: string }, GenerateInviteResponse>(functions, "generateInviteToken");
export const deleteUser = httpsCallable(functions, "deleteUser")