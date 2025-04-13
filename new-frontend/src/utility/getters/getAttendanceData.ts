import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Attendance, AttendanceObject } from "../types";

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
    const attendanceData: AttendanceObject = {};
    for (const attendanceDoc of attendanceDocs.docs) {
        attendanceData[attendanceDoc.id] = attendanceDoc.data() as Attendance;
    }
    return attendanceData;
};
