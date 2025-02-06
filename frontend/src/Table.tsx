import { SetStateAction } from "react"
import { Student } from "./types"

export default function Table({filtered, setProfile}: {filtered: Student[], setProfile: React.Dispatch<SetStateAction<Student | null>>}) {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2 w-1/4">First Name</th>
                    <th className="border border-gray-300 p-2 w-1/4">Last Name</th>
                    <th className="border border-gray-300 p-2 w-1/4">School Year</th>
                    <th className="border border-gray-300 p-2 w-1/4">Teacher</th>
                </tr>
            </thead>
            <tbody>
                {
                    filtered.map((student) => (
                        <tr key={student.id} onClick={() => setProfile(student)} className="hover:bg-gray-100"> 
                            <td className="border border-gray-300 p-2 w-1/4">{student.firstName}</td>
                            <td className="border border-gray-300 p-2 w-1/4">{student.lastName}</td>
                            <td className="border border-gray-300 p-2 w-1/4">{student.schoolYear}</td>
                            <td className="border border-gray-300 p-2 w-1/4">
                                {student["teacher"]["firstName"]}, {student["teacher"]["lastName"]}
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}