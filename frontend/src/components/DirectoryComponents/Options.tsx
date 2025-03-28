import React, { useState } from "react";

interface OptionsProps {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    setIsMultiSelect: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Options({
    setShowForm,
    setIsMultiSelect,
}: OptionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative inline-block">
            {/* Main trigger button with hamburger icon */}
            <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setIsOpen(false)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${
                        isOpen
                            ? "text-blue-500"
                            : "text-gray-500 hover:text-blue-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Dropdown options - shown only when isOpen is true */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur event when clicking inside
                >
                    <ul className="py-1">
                        <li>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                        />
                                    </svg>
                                    Add Student
                                </div>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    setIsMultiSelect(true);
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                    Create Collection
                                </div>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
