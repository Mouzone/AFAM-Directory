interface AttendanceToggleProps {
    isPresent: boolean;
    onChange: () => Promise<void>;
}
export default function AttendanceToggle({
    isPresent,
    onChange,
}: AttendanceToggleProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="relative inline-flex items-center">
                <input
                    type="checkbox"
                    id="attendanceToggle"
                    className="sr-only peer"
                    checked={isPresent}
                    onChange={onChange}
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
    );
}
