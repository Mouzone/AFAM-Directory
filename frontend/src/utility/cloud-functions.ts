import { functions } from "./firebase";
import { httpsCallable, HttpsCallableResult } from "firebase/functions";

export const createUserWithRole = httpsCallable(
    functions,
    "createUserWithRole"
);
export const sendInviteToken = httpsCallable<
    { role: string; email: string },
    {
        data: {
            error?: string;
        };
    }
>(functions, "sendInviteToken");
export const deleteUser = httpsCallable(functions, "deleteUser");
export const toggleWelcomeTeamLeader = httpsCallable(
    functions,
    "toggleWelcomeTeamLeader"
);
export const deleteStudent = httpsCallable(functions, "deleteStudent");
