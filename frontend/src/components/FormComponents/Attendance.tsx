"use client";

import { AttendanceInfoType } from "@/types";
import { db } from "@/utility/firebase";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import AttendanceToggle from "../InputComponents/AttendanceToggle";
import { months } from "@/utility/consts";

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
                [key]: !attendanceState[key],
                date: Timestamp.fromDate(new Date(selectedDate)),
            });
            setAttendanceData({
                ...attendanceData,
                [selectedDate]: {
                    ...attendanceState,
                    [key]: !attendanceState[key],
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
    const firstDay = new Date(year, month - 1, 1);

    const lastDay = new Date(year, month, 0);
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
    const yearsToGenerate = useMemo(() => {
        const years = [];
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 2025; year--) {
            years.push(
                <option key={year} value={year}>
                    {year}
                </option>
            );
        }
        return years;
    }, []);

    return (
        <div className="p-4 justify-items-center">
            <div>
                <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="font-bold"
                >
                    {months.map((month, index) => (
                        <option
                            key={month}
                            value={index}
                            className="text-right"
                        >
                            {month}
                        </option>
                    ))}
                </select>
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="font-bold"
                >
                    {yearsToGenerate}
                </select>
            </div>
            <div className="grid grid-cols-7 gap-x-10 gap-y-2 mt-3">
                {fillerSquares}
                {dateRange.map((date) => {
                    let content = "Neither Attended";
                    if (date in attendanceData) {
                        const { sermonAttendance, classAttendance } =
                            attendanceData[date];

                        if (sermonAttendance && classAttendance) {
                            content = "Both Attended";
                        } else if (sermonAttendance) {
                            content = "Sermon Attended";
                        } else if (classAttendance) {
                            content = "Class Attended";
                        }
                    }
                    return <Cell date={date} content={content} />;
                })}
            </div>
        </div>
    );
}

interface CellProps {
    date: string;
    content: string;
}
function Cell({ date, content }: CellProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The element that triggers the tooltip */}
            <div
                className={`w-6 h-6 bg-gray-100 rounded-sm flex items-center justify-center text-sm font-semibold transition-colors duration-200 date ==
                                    ${
                                        date ===
                                        new Date().toISOString().split("T")[0]
                                            ? "border-2 border-blue-700"
                                            : ""
                                    }`}
            >
                {content !== "Neither Attended" ? content[0] : ""}
            </div>

            {/* Custom Tooltip */}
            {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded-md whitespace-nowrap z-10">
                    {`${date}: ${content}`}
                </div>
            )}
        </div>
    );
}
