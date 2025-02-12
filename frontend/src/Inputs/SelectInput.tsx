export default function SelectInput({label, value, options, onChange, disabled}: {label: string, value: string, options: string[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, disabled: boolean}) {
    return (
        <div className="flex flex-col">
            <label className="font-bold">{label}</label>
            <select
                name="schoolYear"
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded p-2"
                required
                disabled={disabled}
            >
                <option value="">Select</option>
                {
                    options.map(option => <option value={option} key={option}>{option}</option>)
                }
            </select>
        </div>
    )
}