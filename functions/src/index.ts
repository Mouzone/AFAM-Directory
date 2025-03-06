import { https } from "firebase-functions";
import * as admin from "firebase-admin";
type AccountData = {
    uid?: string;
    firstName?: string,
    lastName?: string,
    email?: string;
    password?: string;
};

admin.initializeApp();
const authAdmin = admin.auth();

export const generateInviteToken = https.onCall(async (request) => {
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

        const uid = await admin.firestore().collection("temp").doc().id;
        const token = await admin.auth().createCustomToken(uid);
        await admin
            .firestore()
            .collection("users")
            .doc(uid)
            .set({ role: roleToCreate });

        await admin.firestore().collection("temp").doc().delete();
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
    const { uid, firstName, lastName, email, password } = request.data as AccountData;

    if (!uid || !firstName || !lastName || !email || !password) {
        throw new https.HttpsError(
            "invalid-argument",
            "Missing required parameters."
        );
    }

    try {
        const userRecord = await authAdmin.updateUser(uid, {
            email,
            password,
        });

        const userDoc = await admin
            .firestore()
            .collection("users")
            .doc(uid)
            .get();
        if (!userDoc.exists) {
            await admin.auth().deleteUser(uid)
            throw new https.HttpsError(
                "internal",
                "Role information not found"
            );
        }
        const userData = userDoc.data();

        if (!userData || !userData.role) {
            throw new Error("User role data is missing or invalid");
        }

        const role = userData.role;
        await admin.auth().setCustomUserClaims(uid, { role });
        await admin.firestore().collection("organization").doc("roles").collection(role).doc(uid).create({firstName, lastName, email})

        return { result: `User ${userRecord.uid} created with role ${role}.` };
    } catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof Error) {
            throw new https.HttpsError("internal", error.message);
        }
        throw new https.HttpsError("internal", "An unknown error occurred.");
    } finally {
        await admin.firestore().collection("users").doc(uid).delete();
    }
});
