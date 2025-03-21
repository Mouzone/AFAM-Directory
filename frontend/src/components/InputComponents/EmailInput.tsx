import {
    mandatoryGeneralDataKeys,
    mandatoryPrivateDataKeys,
} from "@/utility/consts";
import isMandatory from "@/utility/isMandatory";

interface EmailInputProps {
    label: string;
    value: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}

export default function EmailInput({
    label,
    value,
    name,
    onChange,
    disabled,
}: EmailInputProps) {
    return (
        <div className="flex flex-col">
            <label className="font-bold">
                {label}
                {isMandatory(name) && <span className="text-red-400"> *</span>}
            </label>
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
    );
}
