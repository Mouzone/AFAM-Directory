import { https } from "firebase-functions";
import * as admin from "firebase-admin";
type AccountData = {
    email?: string;
    password?: string;
    role?: string;
};

admin.initializeApp();
const authAdmin = admin.auth();

export const generateInviteLink = https.onCall(async (request) => {
    if (!request.auth) {
        throw new https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    try {
        const userToken = request.auth.token;
        const userRole = userToken.role;
        const { role: roleToCreate } = request.data;
        if (!userRole) {
            throw new https.HttpsError(
                "permission-denied",
                "The request has no role."
            );
        }

        const disallowedRoles = ["student", "teacher", "deacon"];
        if (disallowedRoles.includes(userRole)) {
            throw new https.HttpsError(
                "permission-denied",
                "The role cannot send invites."
            );
        }

        if (userRole === "pastor" && roleToCreate === "admin") {
            throw new https.HttpsError(
                "permission-denied",
                "Invalid role to invite."
            );
        }

        if (userRole === "welcome team leader" && roleToCreate !== "student") {
            throw new https.HttpsError(
                "permission-denied",
                "Invalid role to invite."
            );
        }

        if (!roleToCreate) {
            throw new https.HttpsError(
                "invalid-argument",
                "Missing required parameters."
            );
        }

        const uid = admin.firestore().collection('temp').doc().id
        const token = await admin.auth().createCustomToken(uid, { roleToCreate });

        return { token };
    } catch (error) {
        console.error("Error generating invite link:", error);

        if (error instanceof https.HttpsError) {
            throw error; // Re-throw Firebase Functions errors as they are.
        } else if (error instanceof Error) {
            throw new https.HttpsError("internal", error.message);
        } else {
            throw new https.HttpsError(
                "internal",
                "An unknown error occurred."
            );
        }
    }
});

export const createUserWithRole = https.onCall(async (request) => {
    const { email, password, role } = request.data as AccountData;

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
