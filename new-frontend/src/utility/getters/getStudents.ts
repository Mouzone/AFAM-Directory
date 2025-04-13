import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { StudentGeneralInfoObject, StudentGeneralInfo } from "../types";

export const getStudents = async (directoryId: string) => {
    const studentsCollectionRef = collection(
        db,
        "directory",
        directoryId,
        "student"
    );
    const studentDocs = await getDocs(studentsCollectionRef);

    const students: StudentGeneralInfoObject = {};
    studentDocs.docs.forEach(
        (studentDoc) =>
            (students[studentDoc.id] = studentDoc.data() as StudentGeneralInfo)
    );

    return students;
};
