export default function TextInput({label, value, name, onChange, disabled}: {label: string, value: string, name: string,onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean}){
    const formatZipCode = (value: string) => {
        const cleaned = value.replace(/[^0-9]/g, ''); // Remove non-numeric chars
        return cleaned.slice(0, 5); // Limit to 5 digits
      }

    return (
        <div className="flex flex-col">
            <label className="font-bold">{label}</label>
            <input
                type="text"
                name={name}
                value={label === "Zip Code" ? formatZipCode(value) : value}
                onChange={onChange}
                className="border border-gray-300 rounded p-2"
                required
                disabled={disabled}
                maxLength={label === "Zip Code" ? 5 : undefined}
            />
        </div>
    )
}
