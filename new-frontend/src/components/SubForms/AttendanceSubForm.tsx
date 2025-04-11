import { useState } from "react";

export default function AttendanceSubForm({ data, setAttendanceFormData }) {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [attendance, setAttendance] = useState(
        data[date] ?? { "Sermon Attendance": false, "Class Attendance": false }
    );

    return (
        <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend">Attendance</legend>

            <div className="flex gap-2 justify-center">
                <label className="fieldset-label">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <div className="flex gap-8">
                <div className="flex gap-4">
                    <label className="fieldset-label">Sermon Attendance</label>
                    <input
                        type="checkbox"
                        checked={attendance["Sermon Attendance"]}
                        onChange={() =>
                            setAttendance({
                                ...attendance,
                                "Sermon Attendance":
                                    !attendance["Sermon Attendance"]!,
                            })
                        }
                        className="toggle checked:bg-green-400 checked:text-green-800 checked:border-green-500 "
                    />
                </div>
                <div className="flex gap-4">
                    <label className="fieldset-label">Class Attendance</label>
                    <input
                        type="checkbox"
                        checked={attendance["Class Attendance"]}
                        onChange={() =>
                            setAttendance({
                                ...attendance,
                                "Class Attendance":
                                    !attendance["Class Attendance"]!,
                            })
                        }
                        className="toggle checked:bg-green-400 checked:text-green-800 checked:border-green-500 "
                    />
                </div>
            </div>
        </fieldset>
    );
}
