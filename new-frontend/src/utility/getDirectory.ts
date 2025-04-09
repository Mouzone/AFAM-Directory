import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getDirectory = async (selectedDirectory: string) => {
    const studentDocs = await getDocs(
        collection(db, "directory", selectedDirectory, "student")
    );

    return studentDocs.docs.map((studentDoc) => {
        return { ...studentDoc.data(), id: studentDoc.id };
    });
};
