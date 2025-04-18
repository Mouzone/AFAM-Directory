import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { StudentGeneralInfo } from "../types";

export const getStudents = async (directoryId: string) => {
    const studentsCollectionRef = collection(
        db,
        "directory",
        directoryId,
        "student"
    );
    const studentDocs = await getDocs(studentsCollectionRef);

    return studentDocs.docs.map((studentDoc) => {
        return {
            Id: studentDoc.id,
            ...studentDoc.data(),
        } as StudentGeneralInfo;
    });
};
