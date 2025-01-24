import { useState } from "react"
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const labels = {
    firstName: "First Name",
    lastName: "Last Name",
    schoolYear: "Grade",
    teacher: "Teacher"
}

function App() {
    const [searchValues, setSearchValues] = useState({
        firstName: "",
        lastName: "",
        schoolYear: "",
        teacher: "",
    })
    console.log(searchValues)
    const { data, error, isLoading } = useSWR('http://localhost:3000/students', fetcher)
    if (error) {
        return <div>Failed to load data.</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    const filtered = data.filter((entry) => {
        return entry["firstName"].toLowerCase().includes(searchValues["firstName"].toLowerCase())
            && entry["lastName"].toLowerCase().includes(searchValues["lastName"].toLowerCase())
            &&  (!parseInt(searchValues["schoolYear"]) || entry["schoolYear"] === parseInt(searchValues["schoolYear"]))
            && entry["afamTeacher"]["firstName"].toLowerCase().includes(searchValues["teacher"].toLowerCase())
    })

    return (
        <>
            <div>
                {
                    Object.entries(searchValues).map(([key, value]) => (
                        <>
                            <label>{labels[key]}</label>
                            <input key={key} value={value} onChange={(e) => setSearchValues({...searchValues, [key]: e.target.value})}/>
                        </>
                    ))
                }
            </div>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>School Year</th>
                        <th>Teacher</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filtered.map((student) => (
                            <tr key={student.id}>
                                <td>{student.firstName}</td>
                                <td>{student.lastName}</td>
                                <td>{student.schoolYear}</td>
                                <td>{student.afamTeacher.firstName}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}

export default App;