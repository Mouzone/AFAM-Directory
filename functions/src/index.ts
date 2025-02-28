import { https } from "firebase-functions";
import * as admin from "firebase-admin"; // Import the whole admin module

type AccountData = {
    email?: string,
    password?: string,
    role?: string
}

type Role = "pastor" | "teacher" | "deacon" | "student" | "welcome team leader"
type RoleData = {
    role?: Role,
}

admin.initializeApp();
const authAdmin = admin.auth();

// check who is sending request
// if it is authenticated: then check role 
// hardcode check that role is pastor, deacon, student, teacher, welcome team leader
export const createUserWithRole = https.onCall(async (data, _context) => {
    const { email, password, role } = data as AccountData;

    if (!email || !password || !role) {
        throw new https.HttpsError(
            "invalid-argument",
            "Missing required parameters."
        );
    }

    try {
        const userRecord = await authAdmin.createUser({
            email,
            password,
        });

        await authAdmin.setCustomUserClaims(userRecord.uid, { role });

        return { result: `User ${userRecord.uid} created with role ${role}.` };
    } catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof Error) {
            throw new https.HttpsError("internal", error.message);
        }
        throw new https.HttpsError("internal", "An unknown error occurred."); 
    }
});


export const generateInviteLink = https.onCall(async (data, _context) => {
    const { role } = data as RoleData;

    if (!role) {
        throw new https.HttpsError(
            "invalid-argument",
            "Missing required parameters."
        );
    }

    try {
        const token = await authAdmin.createCustomToken("deez", { role });
        const link = `https://your-app.com/signup?token=${token}`;
        return { link };
    } catch (error) {
        console.error("Error generating invite link:", error);
        if (error instanceof Error) {
            throw new https.HttpsError("internal", error.message);
        }
        throw new https.HttpsError("internal", "An unknown error occurred.");
    }
});
