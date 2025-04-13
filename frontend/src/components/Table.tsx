import { schema } from "@/utility/consts";
import { db } from "@/utility/firebase";
import { StudentGeneralInfoObject } from "@/utility/types";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    writeBatch,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

type TableProps = {
    data: StudentGeneralInfoObject;
    showEditStudent: (studentId: string) => void;
    showDeleteStudents: boolean;
    setData: Dispatch<SetStateAction<StudentGeneralInfoObject>>;
};
export default function Table({
    data,
    showEditStudent,
    showDeleteStudents,
    setData,
}: TableProps) {
    const deleteStudent = async (studentId: string) => {
        const studentDocRef = doc(
            db,
            "directory",
            "afam",
            "student",
            studentId
        );
        const [privateDocs, attendanceDocs] = await Promise.all([
            getDocs(collection(studentDocRef, "private")),
            getDocs(collection(studentDocRef, "attendance")),
        ]);

        const batch = writeBatch(db);

        // Add all deletes to batch
        privateDocs.forEach((doc) => batch.delete(doc.ref));
        attendanceDocs.forEach((doc) => batch.delete(doc.ref));
        batch.delete(studentDocRef);
        await batch.commit();

        await deleteDoc(studentDocRef);
        const { [studentId]: _omitted, ...studentsAfterDelete } = data;
        setData(studentsAfterDelete);
    };
    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        {showDeleteStudents && <th></th>}
                        {schema.map((field) => (
                            <th key={field}>{field}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data).map(([studentId, studentData]) => (
                        <tr
                            className="hover:bg-base-300"
                            key={studentId}
                            onClick={() => showEditStudent(studentId)}
                        >
                            {showDeleteStudents && (
                                <td
                                    className="text-red-400"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteStudent(studentId);
                                    }}
                                >
                                    Delete
                                </td>
                            )}
                            {schema.map((field) => (
                                <td key={field}>{studentData[field]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
