import {onCall, HttpsError} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();
const firestore = getFirestore();

export const inviteStaff = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const {email} = request.data;

  if (!email) {
    throw new HttpsError("invalid-argument", "The request has no email.");
  }

  // if already in staff, do nothing
  const existsInStaffQuery = await firestore
    .collection("directory")
    .doc("afam")
    .collection("staff")
    .where("Email", "==", email)
    .count()
    .get();

  if (existsInStaffQuery.data().count === 1) {
    throw new HttpsError("already-exists", "Staff member is already invited");
  }

  // search through users for the email
  // copy info and add it to staff with `Private` and `Manage Accounts` permissions
  // will only be one doc, since emails are only allowed to be used once
  const user = await firestore
    .collection("user")
    .where("Email", "==", email)
    .get();

  if (user.empty) {
    throw new HttpsError(
      "invalid-argument",
      "No account associated with the email"
    );
  }

  // copy user personal info to staff directory
  await firestore
    .collection("directory")
    .doc("afam")
    .collection("staff")
    .doc(user.docs[0].id)
    .set({...user.docs[0].data(), Private: false, "Manage Accounts": false});

  // add directory to user's available directories
  await firestore
    .collection("user")
    .doc(user.docs[0].id)
    .collection("directory")
    .doc("afam")
    .set({
      name: "afam",
      Private: false,
      "Manage Accounts": false,
    });
});

export const deleteStudent = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const {studentId} = request.data;

  if (!studentId) {
    throw new HttpsError("invalid-argument", "The request has no student id.");
  }

  const studentRef = firestore
    .collection("directory")
    .doc("afam")
    .collection("student")
    .doc(studentId);

  // Delete attendance subcollection documents in a batch
  const attendanceDocs = await studentRef.collection("attendance").get();
  const batch = firestore.batch();
  attendanceDocs.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit(); // <-- You missed this line

  // Delete private/data doc
  await studentRef.collection("private").doc("data").delete();

  // Delete student doc
  await studentRef.delete();
});
