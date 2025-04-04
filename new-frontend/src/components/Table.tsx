export default function Table({ schema, data }) {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        {schema.map((field) => (
                            <th key={field}>{field}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((person) => (
                        <tr key={person.id}>
                            {schema.map((field) => (
                                <td key={field}>{person[field]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
