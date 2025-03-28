import React from "react";
import { StudentGeneralInfo } from "../../types";
interface TableProps {
    filtered: StudentGeneralInfo[];
    editForm: (student: StudentGeneralInfo) => void;
    isMultiSelect: boolean;
    multiSelectStudents: Set<string>;
    setMultiSelectStudents: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function Table({
    filtered,
    editForm,
    isMultiSelect,
    multiSelectStudents,
    setMultiSelectStudents,
}: TableProps) {
    const checkToggle = (
        e: React.MouseEvent<HTMLInputElement, MouseEvent>,
        id: string
    ) => {
        e.stopPropagation();
        const newSet = new Set(multiSelectStudents);
        if (multiSelectStudents.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setMultiSelectStudents(newSet);
    };
    return (
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
                    <th className="border border-gray-300 p-2 w-1/4">Grade</th>
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
                                    checked={multiSelectStudents.has(
                                        student.id
                                    )}
                                    onClick={(e) => checkToggle(e, student.id)}
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
    );
}
