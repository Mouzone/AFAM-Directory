import isMandatory from "@/utility/isMandatory";

interface TextInputProps {
    label: string;
    value: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}
export default function TextInput({
    label,
    value,
    name,
    onChange,
    disabled,
}: TextInputProps) {
    const formatZipCode = (value: string) => {
        const cleaned = value.replace(/[^0-9]/g, ""); // Remove non-numeric chars
        return cleaned.slice(0, 5); // Limit to 5 digits
    };

    const formatText = (value: string) => {
        if (!value) return value; // Handle null or empty strings
        const valueParts = value
            .split(" ")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
        return valueParts.join(" ");
    };

    return (
        <div className="flex flex-col">
            <label className="font-bold">
                {label}
                {isMandatory(name) && <span className="text-red-400"> *</span>}
            </label>
            <input
                type="text"
                name={name}
                value={
                    label === "Zip Code"
                        ? formatZipCode(value)
                        : formatText(value)
                }
                onChange={onChange}
                className="border border-gray-300 rounded p-2"
                required
                disabled={disabled}
                maxLength={label === "Zip Code" ? 5 : undefined}
            />
        </div>
    );
}
