import { https } from "firebase-functions";
import * as admin from "firebase-admin"; // Import the whole admin module

admin.initializeApp();
const authAdmin = admin.auth();

export const createUserWithRole = https.onCall(async (data, context) => {
    const { email, password, role } = data;

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
        throw new https.HttpsError("internal", error.message);
    }
});

export const generateInviteLink = https.onCall(async (data, context) => {
    const { role } = data;

    if (!role) {
        throw new https.HttpsError(
            "invalid-argument",
            "Missing required parameters."
        );
    }

    try {
        const token = await authAdmin.createCustomToken({ role });
        const link = `https://your-app.com/signup?token=${token}`;
        return { link };
    } catch (error) {
        console.error("Error generating invite link:", error);
        throw new https.HttpsError("internal", error.message);
    }
});
