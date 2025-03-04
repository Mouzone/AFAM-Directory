import { https } from "firebase-functions";
import * as admin from "firebase-admin";
type AccountData = {
    email?: string;
    password?: string;
    role?: string;
};

admin.initializeApp();
const authAdmin = admin.auth();

// check who is sending request
// if it is authenticated: then check role
// hardcode check that role is pastor, deacon, student, teacher, welcome team leader
export const generateInviteLink = https.onCall(async (request) => {
    if (!request.auth) {
        throw new https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    try {
        const userToken = request.auth.token;
        const customClaims = userToken.custom_claims;
        const { role } = request.data;

        if (!customClaims || !customClaims.role) {
            throw new https.HttpsError(
                "permission-denied",
                "The request has no role."
            );
        }

        const disallowedRoles = ["student", "teacher", "deacon"];
        if (disallowedRoles.includes(customClaims.role)) {
            throw new https.HttpsError(
                "permission-denied",
                "The role cannot send invites."
            );
        }

        if (customClaims.role === "pastor" && role === "admin") {
            throw new https.HttpsError(
                "permission-denied",
                "Invalid role to invite."
            );
        }

        if (customClaims.role === "welcome team leader" && role !== "student") {
            throw new https.HttpsError(
                "permission-denied",
                "Invalid role to invite."
            );
        }

        if (!role) {
            throw new https.HttpsError(
                "invalid-argument",
                "Missing required parameters."
            );
        }

        const token = await admin.auth().createCustomToken("deez", { role }); // Consider replacing 'deez' with a more appropriate UID.
        const link = `https://your-app.com/signup?token=${token}`;

        return { link };
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
