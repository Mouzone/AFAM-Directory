"use client";

import { AttendanceInfoType } from "@/types";
import { db } from "@/utility/firebase";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useState } from "react";

interface AttendanceProps {
    id: string;
    attendanceData: { [key: string]: AttendanceInfoType };
    setAttendanceData: React.Dispatch<
        React.SetStateAction<{ [key: string]: AttendanceInfoType }>
    >;
}

export default function Attendance({
    id,
    attendanceData,
    setAttendanceData,
}: AttendanceProps) {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10)
    );

    // todo: add abort controller
    const toggleSelectedDateAttendance = async () => {
        const docRef = doc(db, "students", id, "attendance", selectedDate);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            await updateDoc(docRef, {
                ...attendanceData[selectedDate],
                sermonAttendance:
                    !attendanceData[selectedDate]["sermonAttendance"],
            });
            setAttendanceData({
                ...attendanceData,
                [selectedDate]: {
                    ...attendanceData[selectedDate],
                    sermonAttendance:
                        !attendanceData[selectedDate]["sermonAttendance"],
                },
            });
        } else {
            await setDoc(docRef, {
                date: Timestamp.fromDate(new Date(selectedDate)),
                sermonAttendance: true,
                classAttendance: false,
            });
            setAttendanceData({
                ...attendanceData,
                [selectedDate]: {
                    date: Timestamp.fromDate(new Date(selectedDate)).toString(),
                    sermonAttendance: true,
                    classAttendance: false,
                },
            });
        }
    };

    return (
        <>
            <label> Attendance </label>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />
            <input
                type="checkbox"
                checked={
                    attendanceData[selectedDate]?.sermonAttendance ?? false
                }
                onChange={() => toggleSelectedDateAttendance()}
            />
        </>
    );
}
