import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getDirectory = async (selectedDirectory: string) => {
    const directoryRef = collection(
        db,
        "directory",
        selectedDirectory,
        "student"
    );
    const studentDocs = await getDocs(directoryRef);

    const allStudentData = {};

    for (const studentDoc of studentDocs.docs) {
        const studentId = studentDoc.id;
        const privateDataRef = doc(directoryRef, studentId, "private", "data");
        const privateDataDoc = await getDoc(privateDataRef);

        allStudentData[studentId] = {
            General: { ...studentDoc.data() },
            Private: { ...privateDataDoc.data() },
        };
    }

    return allStudentData;
};
