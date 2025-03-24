import { GenerateInviteResponse } from "@/types";
import { functions } from "./firebase";
import { httpsCallable } from "firebase/functions";

export const createUserWithRole = httpsCallable(
    functions,
    "createUserWithRole"
);
export const generateInviteToken = httpsCallable(
    functions,
    "generateInviteToken"
);
export const deleteUser = httpsCallable(functions, "deleteUser");
export const toggleWelcomeTeamLeader = httpsCallable(
    functions,
    "toggleWelcomeTeamLeader"
);
export const deleteStudent = httpsCallable(functions, "deleteStudent");
