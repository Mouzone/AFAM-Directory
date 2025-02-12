export default function EmailInput({label, value, name, onChange, disabled}: {label: string, value: string, name: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean}) {
    return (
        <div className="flex flex-col">
            <label className="font-bold">{label}</label>
            <input
                type="email"
                name={name}
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded p-2"
                required
                disabled={disabled}
            />
        </div>
    )
}
