import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getPrivateData = async (studentId) => {
    const privateDocRef = doc(
        db,
        "directory",
        "afam",
        "student",
        studentId,
        "private",
        "data"
    );
    const privateDoc = await getDoc(privateDocRef);
    return privateDoc.data();
};
