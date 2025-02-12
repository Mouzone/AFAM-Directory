import { useState } from "react"

export default function AllergiesInput({allergies, handleAllergiesChange, disabled}: {allergies: string[], handleAllergiesChange: (allergy: string) => void, disabled: boolean}) {
    const [input, setInput] = useState("")
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input !== "") {
            handleAllergiesChange(input); 
            setInput(""); 
            e.preventDefault()
        }
    }
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
        </div>
    )
}