export default function Table({ schema, data }) {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        {schema.map((field) => (
                            <th>{field}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((person) => (
                        <tr>
                            {schema.map((field) => (
                                <td>{person[field]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
