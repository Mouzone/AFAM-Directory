import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getStudents = async (selectedDirectory: string) => {
    const studentDocs = await getDocs(
        collection(db, "directories", selectedDirectory, "people")
    );
    return studentDocs.docs.map((studentDoc) => {
        return { ...studentDoc.data(), id: studentDoc.id };
    });
};
