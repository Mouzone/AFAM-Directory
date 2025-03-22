import isMandatory from "@/utility/isMandatory";

interface SelectInputProps {
    label: string;
    value: string;
    name: string;
    options: string[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled: boolean;
}

export default function SelectInput({
    label,
    value,
    name,
    options,
    onChange,
    disabled,
}: SelectInputProps) {
    return (
        <div className="flex flex-col">
            <label className="font-bold">
                {label}
                {isMandatory(name) && <span className="text-red-400"> *</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded p-2"
                required
                disabled={disabled}
            >
                <option value="">Select</option>
                {options.map((option) => (
                    <option value={option} key={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}
