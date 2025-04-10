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

    const directory = {};
    studentDocs.docs.forEach(
        (studentDoc) => (directory[studentDoc.id] = studentDoc.data())
    );

    return directory;
};
