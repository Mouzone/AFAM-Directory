import { AttendanceInfoType } from "@/types";
import { useState } from "react";
import { months } from "@/utility/consts";
import CalendarCell from "./CalendarCell";

const generateDateRange = (year: number, month: number) => {
    const firstDay = new Date(year, month - 1, 1);

    const lastDay = new Date(year, month, 0);
    const dates = [];
    for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
        dates.push(day.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }

    return dates;
};

const generateYears = () => {
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
};

const yearsToGenerate = generateYears();
const todaysDate = new Date();
export default function Calendar({
    attendanceData,
}: {
    attendanceData: { [key: string]: AttendanceInfoType };
}) {
    const [year, setYear] = useState(todaysDate.getFullYear());
    const [month, setMonth] = useState(todaysDate.getMonth());
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
                    return (
                        <CalendarCell
                            key={date}
                            date={date}
                            content={content}
                        />
                    );
                })}
            </div>
        </div>
    );
}
