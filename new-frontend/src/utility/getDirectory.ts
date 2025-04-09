import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getDirectory = async (selectedDirectory: string) => {
    const studentDocs = await getDocs(
        collection(db, "directory", selectedDirectory, "student")
    );

    const db = admin.firestore();
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    const allUserData = [];

    for (const userDoc of snapshot.docs) {
        const userId = userDoc.id;
        const privateDataRef = userDoc.ref.collection("private").doc("data");
        const privateDataDoc = await privateDataRef.get();

        allUserData.push({
            uid: userId,
            mainData: userDoc.data(),
            privateData: privateDataDoc.exists ? privateDataDoc.data() : null,
        });
    }

    // fetch private

    return studentDocs.docs.map((studentDoc) => {
        return { ...studentDoc.data(), id: studentDoc.id };
    });
};
