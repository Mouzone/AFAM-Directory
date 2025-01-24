import { useState } from "react"
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function App() {
    const [searchValues, setSearchValues] = useState({
        firstName: "",
        lastName: "",
        grade: null,
        teacher: "",
    })
    const { data, error, isLoading } = useSWR('http://localhost:3000/students', fetcher)
    if (error) {
        return <div>Failed to load data.</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div>
                {
                    Object.entries(searchValues).map(([key, value]) => (
                        <>
                            <label>{key}</label>
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
                        data.map((student) => (
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