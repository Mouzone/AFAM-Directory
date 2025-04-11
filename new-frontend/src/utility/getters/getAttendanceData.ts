import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getAttendanceData = async (studentId: string) => {
    const attendanceColRef = collection(
        db,
        "directory",
        "afam",
        "student",
        studentId,
        "attendance"
    );
    const attendanceDocs = await getDocs(attendanceColRef);
    const attendanceData = {};
    for (const attendanceDoc of attendanceDocs.docs) {
        attendanceData[attendanceDoc.id] = attendanceDoc.data();
    }
    return attendanceData;
};
