import { schema } from "@/utility/consts";

export default function Table({ data, showEditStudent }) {
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
                    {Object.entries(data).map(([key, value]) => (
                        <tr
                            className="hover:bg-base-300"
                            key={key}
                            onClick={() => showEditStudent(key)}
                        >
                            {schema.map((field) => (
                                <td key={field}>{value[field]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
