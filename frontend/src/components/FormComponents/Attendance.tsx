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
        <div className="flex flex-col">
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
            </div>
            <Calendar attendanceData={attendanceData} />
        </div>
    );
}

const generateDateRange = (year: number, month: number) => {
    // todo: generate all the dates for the whole month
    // Get the first day of the month
    const firstDay = new Date(year, month - 1, 1);

    // Get the last day of the month
    const lastDay = new Date(year, month, 0); // Day 0 of the next month is the last day of the current month

    // Generate all dates for the month
    const dates = [];
    for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
        dates.push(day.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }

    return dates;
};

function Calendar({
    attendanceData,
}: {
    attendanceData: { [key: string]: AttendanceInfoType };
}) {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());

    const dateRange = generateDateRange(year, month + 1);
    // make the onhover date pop out more
    // change month based on an input right above
    // gray for no attendance
    // red for only sermon
    // yellow for only class
    // green for both
    const fillerSquaresToGenerate = new Date(dateRange[0]).getDay() + 1;
    const fillerSquares = [];
    for (let i = 0; i < fillerSquaresToGenerate; i++) {
        fillerSquares.push(
            <div
                key={`fillerSquare${i}`}
                className="w-4 h-4 rounded-sm bg-white"
            ></div>
        );
    }
    // useMemo for these
    const yearsToGenerate: React.ReactNode[] = [];
    for (let year = new Date().getFullYear(); year >= 2025; year--) {
        yearsToGenerate.push(
            <option key={year} value={year}>
                {year}
            </option>
        );
    }

    // put this in constants
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return (
        <div className="p-4">
            <div>
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                >
                    {yearsToGenerate}
                </select>
                <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                >
                    {months.map((month, index) => (
                        <option key={month} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {fillerSquares}
                {dateRange.map((date) => (
                    <div
                        key={date}
                        className={`w-4 h-4 rounded-sm ${
                            date in attendanceData &&
                            attendanceData[date]["sermonAttendance"]
                                ? "bg-green-500"
                                : "bg-gray-200"
                        }`}
                        title={`${date}: ${
                            date in attendanceData &&
                            attendanceData[date]["sermonAttendance"]
                                ? "Contribution"
                                : "No Contribution"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
