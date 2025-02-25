import { Student } from "../types";
import TextInput from "../Inputs/TextInput";
import SelectInput from "../Inputs/SelectInput";
import PhoneInput from "../Inputs/PhoneInput";
import EmailInput from "../Inputs/EmailInput";

interface MainInfoProps {
    formData: Student;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    disabled: boolean;
}

export default function General({generalData, handleChange, disabled,}: MainInfoProps) {
    const handleMainChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const addAllergy = (allergy: string) => {
        setFormData({
            ...formData,
            allergies: [...formData.allergies, allergy],
        });
    };

    const removeAllergy = (allergyToRemove: string) => {
        setFormData({
            ...formData,
            allergies: formData.allergies.filter(
                (allergy) => allergy !== allergyToRemove
            ),
        });
    };
    const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const teacherName = e.target.value;
            const teacherNameList = teacherName.split(" ");
            const firstName = teacherNameList[0];
            const lastName = teacherNameList[1];
            setFormData({
                ...formData,
                teacher: {
                    firstName,
                    lastName,
                },
            });
        };
    return (
        <div className="grid grid-cols-4 gap-4 w-4xl">
            <TextInput
                label="First Name:"
                value={formData.firstName}
                name="firstName"
                onChange={handleChange}
                disabled={disabled}
            />

            <TextInput
                label="Last Name:"
                value={formData.lastName}
                name="lastName"
                onChange={handleChange}
                disabled={disabled}
            />

            <SelectInput
                label="School Year:"
                value={formData.schoolYear}
                name="schoolYear"
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
                name="gender"
                options={["Male", "Female"]}
                onChange={handleChange}
                disabled={disabled}
            />

            <TextInput
                label="High School:"
                value={formData.highSchool}
                name="highSchool"
                onChange={handleChange}
                disabled={disabled}
            />

            <PhoneInput
                label="Phone Number:"
                value={formData.phoneNumber}
                name="phoneNumber"
                onChange={handleChange}
                disabled={disabled}
            />

            <EmailInput
                label="Email:"
                value={formData.email}
                name="email"
                onChange={handleChange}
                disabled={disabled}
            />

             <SelectInput
                label="Teacher:"
                value={`${formData["teacher"]["firstName"]} ${formData["teacher"]["lastName"]}`}
                name="teacher"
                options={
                    teachers
                        ? teachers.map(
                                (teacher) =>
                                    `${teacher["firstName"]} ${
                                        teacher["lastName"] ?? ""
                                    }`
                            )
                        : []
                }
                onChange={handleTeacherChange}
                disabled={disabled}
            />
            <AllergiesInput
                allergies={formData.allergies}
                addAllergy={addAllergy}
                removeAllergy={removeAllergy}
                disabled={disabled}
            />
        </div>
    );
}
