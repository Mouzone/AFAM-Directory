"use client";

import { AttendanceInfoType } from "@/types";
import { db } from "@/utility/firebase";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import AttendanceToggle from "../InputComponents/AttendanceToggle";

interface AttendanceProps {
    id: string;
    showClassSlider: boolean;
    attendanceData: { [key: string]: AttendanceInfoType };
    setAttendanceData: React.Dispatch<
        React.SetStateAction<{ [key: string]: AttendanceInfoType }>
    >;
}

export default function Attendance({
    id,
    showClassSlider,
    attendanceData,
    setAttendanceData,
}: AttendanceProps) {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10)
    );

    const attendanceState =
        selectedDate in attendanceData
            ? attendanceData[selectedDate]
            : {
                  sermonAttendance: false,
                  classAttendance: false,
              };

    // todo: add abort controller
    const toggleSelectedDateAttendance = async (
        key: "sermonAttendance" | "classAttendance"
    ) => {
        const docRef = doc(db, "students", id, "attendance", selectedDate);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            await updateDoc(docRef, {
                ...attendanceState,
                [key]: !attendanceState[key],
            });
            setAttendanceData({
                ...attendanceData,
                [selectedDate]: {
                    ...attendanceState,
                    [key]: !attendanceState[key],
                },
            });
        } else {
            await setDoc(docRef, {
                ...attendanceState,
                date: Timestamp.fromDate(new Date(selectedDate)),
            });
            setAttendanceData({
                ...attendanceData,
                [selectedDate]: {
                    ...attendanceState,
                },
            });
        }
    };

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg shadow-md bg-white">
            <input
                type="date"
                id="attendanceDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
            />

            <AttendanceToggle
                label="Sermon"
                isPresent={attendanceState["sermonAttendance"]}
                onChange={() =>
                    toggleSelectedDateAttendance("sermonAttendance")
                }
            />

            {showClassSlider && (
                <AttendanceToggle
                    label="Class"
                    isPresent={attendanceState["classAttendance"]}
                    onChange={() =>
                        toggleSelectedDateAttendance("classAttendance")
                    }
                />
            )}

            <div></div>
        </div>
    );
}
