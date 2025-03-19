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

// const generateYears = () => {
//     const years = [];
//     const currentYear = new Date().getFullYear();
//     for (let year = currentYear; year >= 2025; year--) {
//         years.push(year);
//     }
//     return years;
// };

const todaysDate = new Date();
interface CalendarProps {
    attendanceData: { [key: string]: AttendanceInfoType };
}
export default function Calendar({ attendanceData }: CalendarProps) {
    const [year, setYear] = useState(todaysDate.getFullYear());
    const [month, setMonth] = useState(todaysDate.getMonth());

    // const yearsToGenerate = generateYears();
    const dateRange = generateDateRange(year, month + 1);
    const fillerSquaresToGenerate = new Date(dateRange[0]).getDay() + 1;
    const yearsToGenerate = [2025];
    console.log(attendanceData);

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
                    {yearsToGenerate.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-7 gap-x-10 gap-y-2 mt-3">
                {Array.from({ length: fillerSquaresToGenerate }, (_, index) => (
                    <div key={index} className="w-4 h-4 rounded-sm bg-white" />
                ))}
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
