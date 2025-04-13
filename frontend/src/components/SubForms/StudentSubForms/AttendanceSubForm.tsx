import { AttendanceObject } from "@/utility/types";
import { Dispatch, SetStateAction } from "react";

type AttendanceSubFormProps = {
    date: string;
    setDate: Dispatch<SetStateAction<string>>;
    data: AttendanceObject;
    setAttendanceFormData: Dispatch<SetStateAction<AttendanceObject>>;
};
export default function AttendanceSubForm({
    date,
    setDate,
    data,
    setAttendanceFormData,
}: AttendanceSubFormProps) {
    const attendance = data[date] ?? {
        "Sermon Attendance": false,
        "Class Attendance": false,
    };

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
                            setAttendanceFormData({
                                ...data,
                                [date]: {
                                    ...attendance,
                                    "Sermon Attendance":
                                        !attendance["Sermon Attendance"],
                                },
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
                            setAttendanceFormData({
                                ...data,
                                [date]: {
                                    ...attendance,
                                    "Class Attendance":
                                        !attendance["Class Attendance"],
                                },
                            })
                        }
                        className="toggle checked:bg-green-400 checked:text-green-800 checked:border-green-500 "
                    />
                </div>
            </div>
        </fieldset>
    );
}
