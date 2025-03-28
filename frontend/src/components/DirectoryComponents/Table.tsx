import React from "react";
import { StudentGeneralInfo } from "../../types";
interface TableProps {
    filtered: StudentGeneralInfo[];
    editForm: (student: StudentGeneralInfo) => void;
    isMultiSelect: boolean;
    setIsMultiSelect: React.Dispatch<React.SetStateAction<boolean>>;
    multiSelectStudents: string[];
    setMultiSelectStudents: React.Dispatch<React.SetStateAction<string[]>>;
    createCollection: () => void;
}

export default function Table({
    filtered,
    editForm,
    isMultiSelect,
    setIsMultiSelect,
    multiSelectStudents,
    setMultiSelectStudents,
    createCollection,
}: TableProps) {
    const checkToggle = (id: string) => {
        const newList = multiSelectStudents.includes(id)
            ? multiSelectStudents.filter((curr_id) => curr_id !== id)
            : [...multiSelectStudents, id];
        setMultiSelectStudents(newList);
    };

    function exitMultiSelect() {
        setIsMultiSelect(false);
        setMultiSelectStudents([]);
    }

    return (
        <>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        {isMultiSelect && <th> </th>}
                        <th className="border border-gray-300 p-2 w-1/4">
                            First Name
                        </th>
                        <th className="border border-gray-300 p-2 w-1/4">
                            Last Name
                        </th>
                        <th className="border border-gray-300 p-2 w-1/4">
                            Grade
                        </th>
                        <th className="border border-gray-300 p-2 w-1/4">
                            Teacher
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((student) => (
                        <tr
                            key={student.id}
                            onClick={() => editForm(student)}
                            className="hover:bg-gray-100"
                        >
                            {isMultiSelect && (
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={multiSelectStudents.includes(
                                            student.id
                                        )}
                                        onChange={(e) =>
                                            checkToggle(student.id)
                                        }
                                        onClick={(e) => e.stopPropagation()} // if you still need this
                                    />
                                </td>
                            )}
                            <td className="border border-gray-300 p-2 w-1/4">
                                {student.firstName}
                            </td>
                            <td className="border border-gray-300 p-2 w-1/4">
                                {student.lastName}
                            </td>
                            <td className="border border-gray-300 p-2 w-1/4">
                                {student.grade}
                            </td>
                            <td className="border border-gray-300 p-2 w-1/4">
                                {`${student.teacher.firstName}${
                                    student.teacher.lastName
                                        ? ` ${student.teacher.lastName}`
                                        : ""
                                }`}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isMultiSelect && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/4 flex gap-4 p-3">
                    <button
                        onClick={() => {
                            createCollection();
                            exitMultiSelect();
                        }}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors font-medium"
                    >
                        Create
                    </button>
                    <button
                        onClick={() => {
                            exitMultiSelect();
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </>
    );
}
