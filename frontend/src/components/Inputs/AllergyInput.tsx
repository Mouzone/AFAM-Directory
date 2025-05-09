import { useEffect, useState } from "react";

type AllergyInputProps = {
    allergies: string[];
    setAllergies: (allergy: string[]) => void;
};
export default function AllergyInput({
    allergies,
    setAllergies,
}: AllergyInputProps) {
    const [newAllergy, setNewAllergy] = useState("");

    const addAllergy = () => {
        const trimmed = newAllergy.trim();
        if (trimmed && !allergies.includes(trimmed)) {
            setAllergies([...allergies, trimmed]);
        }
        setNewAllergy("");
    };

    const removeAllergy = (indexToRemove: number) => {
        setAllergies(allergies.filter((_, i) => i !== indexToRemove));
    };

    return (
        <div className="form-control flex flex-col">
            <label className="label">
                <span className="label-text">Allergies</span>
            </label>
            <input
                type="text"
                placeholder="Type an allergy and press Enter"
                className="input input-bordered"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        addAllergy();
                    }
                }}
            />

            {/* Allergy tags */}
            <div className="mt-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {allergies.map((allergy, index) => (
                    <div
                        key={index}
                        className="badge badge-primary gap-1 cursor-pointer"
                        onClick={() => removeAllergy(index)}
                    >
                        {allergy}
                        <span className="text-xs ml-1">✕</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
