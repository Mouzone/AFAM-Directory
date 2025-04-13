import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { StudentPrivateInfo } from "../types";

export const getPrivateData = async (studentId: string) => {
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
    return privateDoc.data() as StudentPrivateInfo;
};
