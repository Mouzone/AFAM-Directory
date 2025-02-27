import { useState } from "react";

interface AllergiesInputProps {
    allergies: string[];
    addAllergy: (allergy: string) => void;
    removeAllergy: (allergy: string) => void;
    disabled: boolean;
}

export default function AllergiesInput({allergies, addAllergy, removeAllergy, disabled,}: AllergiesInputProps) {
    const [input, setInput] = useState("");
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input !== "") {
            addAllergy(input.toLowerCase());
            setInput("");
            e.preventDefault();
        }
    };
    return (
        <div className="flex flex-col">
            <label className="font-bold">Allergies (optional):</label>
            <input
                type="text"
                name="allergies"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="border border-gray-300 rounded p-2"
                disabled={disabled}
            />
            <div className="flex flex-wrap mt-2">
                {allergies.map((allergy) => (
                    <div
                        key={allergy}
                        className="p-1 m-1 text-sm border rounded flex items-center"
                    >
                        <span>{allergy}</span>
                        <button
                            onClick={() => removeAllergy(allergy)}
                            type="button"
                            disabled={disabled}
                            className="ml-1"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className={`w-4 h-4 fill-current text-red-500 ${
                                    disabled ? "" : "hover:text-red-700"
                                }`}
                            >
                                <title>close</title>
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
