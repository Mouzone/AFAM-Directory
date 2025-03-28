import {onCall, HttpsError} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {onSchedule} from "firebase-functions/scheduler";
import sgMail from "@sendgrid/mail";

initializeApp();
const auth = getAuth();
const firestore = getFirestore();

export const sendInviteToken = onCall(async (request) => {
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
    const {role: roleToCreate, email: reciever} = request.data;
    if (!userRole) {
      throw new HttpsError("permission-denied", "The request has no role.");
    }

    if (!reciever) {
      throw new HttpsError(
        "permission-denied",
        "The request has no recipient."
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
      throw new HttpsError("invalid-argument", "Missing required parameters.");
    }

    if (userRole === "pastor" && roleToCreate === "admin") {
      throw new HttpsError("permission-denied", "Invalid role to invite.");
    }

    if (isWelcomeTeamLeader && roleToCreate !== "student") {
      throw new HttpsError("permission-denied", "Invalid role to invite.");
    }

    const uid = firestore.collection("temp").doc().id;
    const token = await auth.createCustomToken(uid);
    await firestore.collection("temp").doc(uid).set({
      role: roleToCreate,
    });

    await firestore.collection("temp").doc().delete();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const msg = {
      to: reciever, // Change to your recipient
      from: process.env.SENDER as string, // Change to your verified sender
      subject: "AFAM Directory Account Signup Link",
      html: `<p>Account Link: <a href=https://afam-directory.vercel.app/signup?token=${token}>here</a></p>`,
    };
    try {
      await sgMail.send(msg);
      console.log("Email sent");
      return {success: true};
    } catch (error) {
      console.error("SendGrid Error:", error);
      return {error};
    }
  } catch (error) {
    console.error("Error generating invite link:", error);
    return {error};
  }
});

export const createUserWithRole = onCall(async (request) => {
  const {uid, firstName, lastName, email, password} = request.data;

  if (!uid || !firstName || !lastName || !email || !password) {
    throw new HttpsError("invalid-argument", "Missing required parameters.");
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
    const customClaims: Record<string, unknown> = {role};
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

  const {id} = request.data;

  if (!id) {
    throw new HttpsError("invalid-argument", "Missing required parameters.");
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
    throw new HttpsError("invalid-argument", "Missing required parameters.");
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

// maybe toggle students? but currently can only only toggle deacons and teachers
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

  const {uid} = request.data;
  const userToToggle = await auth.getUser(uid);
  const userToggleCustomClaims = userToToggle.customClaims || {};
  const userTogggleRole = userToggleCustomClaims.role;
  if (!userTogggleRole) {
    throw new HttpsError(
      "permission-denied",
      "UserToToggle does not have a role"
    );
  }
  if ("isWelcomeTeamLeader" in userToggleCustomClaims) {
    const newValue = !userToggleCustomClaims.isWelcomeTeamLeader;
    userToggleCustomClaims.isWelcomeTeamLeader = newValue;
  } else {
    userToggleCustomClaims.isWelcomeTeamLeader = true;
  }

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

export const tokenCleanup = onSchedule("0 0 1 1 *", async () => {
  // Approximate month in milliseconds
  const ONE_MONTH_MILLIS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  try {
    const tempAccounts = await firestore.collection("temp").get();
    const deletePromises: Promise<void>[] = [];

    tempAccounts.forEach((tempAccount) => {
      const createTimeMillis = tempAccount.data().createTime?.toMillis();
      if (createTimeMillis && now - createTimeMillis >= ONE_MONTH_MILLIS) {
        const userId = tempAccount.id;
        deletePromises.push(
          (async () => {
            try {
              await firestore.collection("temp").doc(userId).delete();
              console.log(`Document ${userId} deleted.`);
              try {
                await auth.deleteUser(userId);
                console.log(`User ${userId} deleted.`);
              } catch (authError) {
                console.error("User did not activate link:", authError);
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

  const {id} = request.data;

  if (!id) {
    throw new HttpsError("invalid-argument", "Missing required parameters.");
  }

  const attendanceDocs = await firestore
    .collection("students")
    .doc(id)
    .collection("attendance")
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

// personal_collections > `user.uid` > {collecitons} > {docs}
// make firestore rules for welcome team leader and pastor and check for it specifically depending on user role on frontend
// personal_collections > `general` > birthday
// personal_collections > `general` > new comers

// run weekly for the birthdays that have passed so from Monday to current Sunday is the check
// create a collection, and add student to collection and notify Welcome Team Leader & Pastor
export const getBirthdayStudents = onSchedule("0 9 * * Sun", async () => {
  const documentsToDelete = await firestore
    .collection("collections")
    .doc("birthdays")
    .collection("data")
    .get();
  documentsToDelete.forEach((document) => document.ref.delete());

  const students = await firestore.collection("students").get();
  const today = new Date();
  const beginningOfWeek = Timestamp.fromDate(new Date(today.getDate() - 7));
  const endOfWeek = Timestamp.fromDate(new Date(today.getHours() + 15));

  students.forEach(async (student) => {
    const dob = student.data().dob;
    if (dob <= endOfWeek && dob >= beginningOfWeek) {
      await firestore
        .collection("collections")
        .doc("birthdays")
        .collection("data")
        .doc(student.id)
        .create(student);
    }
  });
});

// get all documents in students that a new creation date at Sunday 5 pm
// create a collection, and send email notifying Welcome Team Leader & Pastor
export const getNewStudents = onSchedule("0 17 * * Sun", async () => {
  // clean "newcomers" collections from each
  const documentsToDelete = await firestore
    .collection("collections")
    .doc("newcomers")
    .collection("data")
    .get();
  documentsToDelete.forEach((document) => document.ref.delete());

  // add to "newcomers" collections to each
  const today = new Date();
  const startTime = Timestamp.fromDate(new Date(today.getHours() - 8));
  const students = await firestore.collection("students").get();
  const todayTimestamp = Timestamp.fromDate(today);
  students.forEach(async (student) => {
    // between 9:00am to 5:00pm today
    if (
      student.createTime >= startTime &&
      student.createTime <= todayTimestamp
    ) {
      await firestore
        .collection("collections")
        .doc("newcomers")
        .collection("data")
        .doc(student.id)
        .create(student);
    }
  });
});
