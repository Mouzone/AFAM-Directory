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

    const isPresent = attendanceData[selectedDate]?.sermonAttendance ?? false;

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg shadow-md bg-white">
            <input
                type="date"
                id="attendanceDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
            />

            <div className="flex items-center gap-2">
                <div className="relative inline-flex items-center">
                    <input
                        type="checkbox"
                        id="attendanceToggle"
                        className="sr-only peer"
                        checked={isPresent}
                        onChange={toggleSelectedDateAttendance}
                    />
                    <label
                        htmlFor="attendanceToggle"
                        className={`relative flex items-center p-1 cursor-pointer w-12 h-6 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors duration-200 ${
                            isPresent ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                        <span
                            className={`inline-block w-4 h-4 bg-white rounded-full transition-transform transform ${
                                isPresent ? "translate-x-0" : "translate-x-6"
                            }`}
                        ></span>
                    </label>
                </div>

                <span
                    className={`text-sm font-medium ${
                        isPresent ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {isPresent ? "Present" : "Absent"}
                </span>
            </div>

            <div></div>
        </div>
    );
}
