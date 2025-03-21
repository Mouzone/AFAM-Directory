import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { onSchedule } from "firebase-functions/scheduler";

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
        const isWelcomeTeamLeader = userToken.isWelcomeTeamLeader ?? false;
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

        if (!roleToCreate) {
            throw new HttpsError(
                "invalid-argument",
                "Missing required parameters."
            );
        }

        if (userRole === "pastor" && roleToCreate === "admin") {
            throw new HttpsError(
                "permission-denied",
                "Invalid role to invite."
            );
        }

        if (isWelcomeTeamLeader && roleToCreate !== "student") {
            throw new HttpsError(
                "permission-denied",
                "Invalid role to invite."
            );
        }

        const uid = firestore.collection("temp").doc().id;
        const token = await auth.createCustomToken(uid);
        await firestore.collection("temp").doc(uid).set({
            role: roleToCreate,
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

        const userDoc = await firestore.collection("temp").doc(uid).get();
        if (!userDoc.exists) {
            await auth.deleteUser(uid);
            throw new HttpsError("internal", "Role information not found");
        }
        const userData = userDoc.data();

        if (!userData || !userData.role) {
            throw new Error("User role data is missing or invalid");
        }

        const role = userData.role;
        const customClaims: Record<string, unknown> = { role };
        const userInfo: Record<string, unknown> = {
            firstName,
            lastName,
            email,
        };
        if (role == "teacher" || role == "deacon") {
            customClaims["isWelcomeTeamLeader"] = false;
            userInfo["isWelcomeTeamLeader"] = false;
        }
        await auth.setCustomUserClaims(uid, customClaims);
        await firestore
            .collection("organization")
            .doc("roles")
            .collection(role)
            .doc(uid)
            .create(userInfo);

        return {
            status: 200,
            result: `User ${userRecord.uid} created with role ${role}.`,
        };
    } catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof Error) {
            throw new HttpsError("internal", error.message);
        }
        throw new HttpsError("internal", "An unknown error occurred.");
    } finally {
        await firestore.collection("temp").doc(uid).delete();
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
    // rename role and requestRole better
    const userToken = request.auth.token;
    const userRole = userToken.role;
    const userIsWelcomeTeamLeader = userToken.isWelcomeTeamLeader;
    const role = claims.role;
    const notAllowedToDelete = ["teacher", "student", "deacon"];
    if (userRole in notAllowedToDelete) {
        throw new HttpsError(
            "permission-denied",
            "User does not have the permission to delete"
        );
    }

    if (!role) {
        throw new HttpsError(
            "invalid-argument",
            "Missing required parameters."
        );
    }

    if (userIsWelcomeTeamLeader && role !== "student") {
        throw new HttpsError(
            "permission-denied",
            "User does not have the permission to delete"
        );
    }

    if (userRole == "pastor" && role !== "admin") {
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

export const toggleWelcomeTeamLeader = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    // only pastor or admin can set it
    const cannotToggle = ["teacher", "deacon", "student"];
    if (cannotToggle.includes(request.auth.token.role)) {
        throw new HttpsError(
            "permission-denied",
            "User does not have the permission to toggle"
        );
    }

    const { uid } = request.data;
    const userToToggle = await auth.getUser(uid);
    const userToggleCustomClaims = userToToggle.customClaims || {};
    const userTogggleRole = userToggleCustomClaims.role;
    if (!userTogggleRole) {
        throw new HttpsError(
            "permission-denied",
            "UserToToggle does not have a role"
        );
    }
    userToggleCustomClaims.isWelcomeTeamLeader =
        "isWelcomeTeamLeader" in userToggleCustomClaims
            ? !userToggleCustomClaims.isWelcomeTeamLeader
            : (userToggleCustomClaims.isWelcomeTeamLeader = true);

    await auth.setCustomUserClaims(uid, userToggleCustomClaims);
    await firestore
        .collection("organization")
        .doc("roles")
        .collection(userTogggleRole)
        .doc(uid)
        .update({
            isWelcomeTeamLeader: userToggleCustomClaims.isWelcomeTeamLeader,
        });
});

export const tokenCleanup = onSchedule("0 0 1 1 *", async (event) => {
    const ONE_MONTH_MILLIS = 30 * 24 * 60 * 60 * 1000; // Approximate month in milliseconds
    const now = Date.now();

    try {
        const tempAccounts = await firestore.collection("temp").get();
        const deletePromises: Promise<void>[] = [];

        tempAccounts.forEach((tempAccount) => {
            const createTimeMillis = tempAccount.data().createTime?.toMillis();
            if (
                createTimeMillis &&
                now - createTimeMillis >= ONE_MONTH_MILLIS
            ) {
                const userId = tempAccount.id;
                deletePromises.push(
                    (async () => {
                        try {
                            await firestore
                                .collection("temp")
                                .doc(userId)
                                .delete();
                            console.log(`Document ${userId} deleted.`);
                            try {
                                await auth.deleteUser(userId);
                                console.log(`User ${userId} deleted.`);
                            } catch (authError) {
                                console.error(
                                    "User did not activate link:",
                                    authError
                                );
                            }
                        } catch (firestoreError) {
                            console.error(
                                `Error deleting document ${userId}:`,
                                firestoreError
                            );
                        }
                    })()
                );
            }
        });

        await Promise.all(deletePromises);
        console.log("Cleanup completed.");
    } catch (error) {
        console.error("Error during cleanup:", error);
    }
});

export const deleteStudent = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    if (request.auth.token.role === "student") {
        throw new HttpsError(
            "permission-denied",
            "Students cannot delete accounts"
        );
    }

    const { id } = request.data;

    if (!id) {
        throw new HttpsError(
            "invalid-argument",
            "Missing required parameters."
        );
    }

    const attendanceDocs = await firestore
        .collection("students")
        .doc(id)
        .collection("accounts")
        .listDocuments();
    attendanceDocs.forEach((doc) => doc.delete());
    await firestore
        .collection("students")
        .doc(id)
        .collection("private")
        .doc("privateInfo")
        .delete();
    await firestore.collection("students").doc(id).delete();
});
