import { Student } from "../types"
import TextInput from "../Inputs/TextInput"
import SelectInput from "../Inputs/SelectInput"
import PhoneInput from "../Inputs/PhoneInput"
import EmailInput from "../Inputs/EmailInput"

export default function MainInfo({formData, handleChange, disabled}: {formData: Student, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, disabled: boolean}){
    return (
        <>
            <TextInput
                label="First Name:"
                value={formData.firstName}
                onChange={handleChange}
                disabled={disabled}
            />

            <TextInput
                label="Last Name:"
                value={formData.lastName}
                onChange={handleChange}
                disabled={disabled}
            />

            <SelectInput
                label="School Year:"
                value={formData.schoolYear}
                options={["9", "10", "11", "12"]}
                onChange={handleChange}
                disabled={disabled}
            />
            
            {/* Date of Birth */}
            <div className="flex flex-col">
                <label className="font-bold">Date of Birth:</label>
                <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

            <SelectInput
                label="School Year:"
                value={formData.gender}
                options={["Male", "Female"]}
                onChange={handleChange}
                disabled={disabled}
            />

            <TextInput
                label="High School:"
                value={formData.highSchool}
                onChange={handleChange}
                disabled={disabled}
            />

            <PhoneInput
                label="Phone Number:"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={disabled}
            />

            <EmailInput
                label="Email:"
                value={formData.email}
                onChange={handleChange}
                disabled={disabled}
            />

            {/* Allergies */}
            <div className="flex flex-col">
                <label className="font-bold">Allergies (optional):</label>
                <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    disabled={disabled}
                />
            </div>
        </>
    )
}