import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

type AccountData = {
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
};

initializeApp();
const auth = getAuth();
const firestore = getFirestore();

export const generateInviteToken = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    try {
        const userToken = request.auth.token;
        const userRole = userToken.role;
        const { role: roleToCreate } = request.data;
        if (!userRole) {
            throw new HttpsError(
                "permission-denied",
                "The request has no role."
            );
        }

        const disallowedRoles = ["student", "teacher", "deacon"];
        if (disallowedRoles.includes(userRole)) {
            throw new HttpsError(
                "permission-denied",
                "The role cannot send invites."
            );
        }

        if (userRole === "pastor" && roleToCreate === "admin") {
            throw new HttpsError(
                "permission-denied",
                "Invalid role to invite."
            );
        }

        if (userRole === "welcome team leader" && roleToCreate !== "student") {
            throw new HttpsError(
                "permission-denied",
                "Invalid role to invite."
            );
        }

        if (!roleToCreate) {
            throw new HttpsError(
                "invalid-argument",
                "Missing required parameters."
            );
        }

        const uid = firestore.collection("temp").doc().id;
        const token = await auth.createCustomToken(uid);
        await firestore.collection("users").doc(uid).set({
            role: roleToCreate,
            created: Timestamp.now(),
        });

        await firestore.collection("temp").doc().delete();
        return { token };
    } catch (error) {
        console.error("Error generating invite link:", error);

        if (error instanceof HttpsError) {
            throw error; // Re-throw Firebase Functions errors as they are.
        } else if (error instanceof Error) {
            throw new HttpsError("internal", error.message);
        } else {
            throw new HttpsError("internal", "An unknown error occurred.");
        }
    }
});

export const createUserWithRole = onCall(async (request) => {
    const { uid, firstName, lastName, email, password } =
        request.data as AccountData;

    if (!uid || !firstName || !lastName || !email || !password) {
        throw new HttpsError(
            "invalid-argument",
            "Missing required parameters."
        );
    }

    try {
        const userRecord = await auth.updateUser(uid, {
            email,
            password,
        });

        const userDoc = await firestore.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            await auth.deleteUser(uid);
            throw new HttpsError("internal", "Role information not found");
        }
        const userData = userDoc.data();

        if (!userData || !userData.role) {
            throw new Error("User role data is missing or invalid");
        }

        const role = userData.role;
        await auth.setCustomUserClaims(uid, { role });
        await firestore
            .collection("organization")
            .doc("roles")
            .collection(role)
            .doc(uid)
            .create({ firstName, lastName, email });

        return { result: `User ${userRecord.uid} created with role ${role}.` };
    } catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof Error) {
            throw new HttpsError("internal", error.message);
        }
        throw new HttpsError("internal", "An unknown error occurred.");
    } finally {
        await firestore.collection("users").doc(uid).delete();
    }
});

export const deleteUser = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    const { id } = request.data;

    if (!id) {
        throw new HttpsError(
            "invalid-argument",
            "Missing required parameters."
        );
    }
    const claims = (await auth.getUser(id)).customClaims;
    if (!claims) {
        throw new HttpsError("internal", "Invalid id, account does not exist");
    }
    const requestRole = request.auth.token.role;
    const role = claims.role;
    const notAllowedToDelete = ["teacher", "student", "deacon"];
    if (requestRole in notAllowedToDelete) {
        throw new HttpsError(
            "permission-denied",
            "User does not have the permission to delete"
        );
    }
    if (requestRole == "welcome team leader" && role !== "student") {
        throw new HttpsError(
            "permission-denied",
            "User does not have the permission to delete"
        );
    }

    await firestore
        .collection("organization")
        .doc("roles")
        .collection(role)
        .doc(id)
        .delete();
    await auth.deleteUser(id);
});
