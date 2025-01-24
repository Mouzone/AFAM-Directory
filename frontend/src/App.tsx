import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function App() {
    const { data, error, isLoading } = useSWR('http://localhost:3000/students', fetcher)

    if (error) {
        return <div>Failed to load data.</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>School Year</th>
            </tr>
        </thead>
        <tbody>
            {
                data.map((student) => (
                    <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.schoolYear}</td>
                    </tr>
                ))
            }
        </tbody>
    </table>
    )
}

export default App;