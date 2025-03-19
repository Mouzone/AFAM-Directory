import { useState } from "react";

interface CellProps {
    date: string;
    content: string;
}
export default function CalendarCell({ date, content }: CellProps) {
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
