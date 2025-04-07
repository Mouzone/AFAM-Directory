import isMandatory from "@/utility/isMandatory";

interface PhoneInputProps {
    label: string;
    value: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}

export default function PhoneInput({
    label,
    value,
    name,
    onChange,
    disabled,
}: PhoneInputProps) {
    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/[^0-9]/g, "");
        let formatted = "";
        for (let i = 0; i < cleaned.length; i++) {
            if (i === 3 || i === 6) {
                formatted += "-";
            }
            formatted += cleaned[i];
        }
        return formatted;
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
                value={formatPhoneNumber(value)}
                onChange={onChange}
                className="border border-gray-300 rounded p-2"
                required
                disabled={disabled}
                maxLength={12}
            />
        </div>
    );
}
