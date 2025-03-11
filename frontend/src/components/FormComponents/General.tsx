import { StudentGeneralInfo, Teacher } from "../../types";
import TextInput from "../InputComponents/TextInput";
import SelectInput from "../InputComponents/SelectInput";
import AllergiesInput from "../InputComponents/AllergiesInput";
import React from "react";

interface GeneralProps {
    disabled: boolean;
    teachers: Teacher[] | undefined;
    generalData: StudentGeneralInfo;
    setGeneralData: React.Dispatch<React.SetStateAction<StudentGeneralInfo>>;
}

export default function General({
    disabled,
    teachers,
    generalData,
    setGeneralData,
}: GeneralProps) {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setGeneralData({
            ...generalData,
            [name]: value,
        });
    };
    const addAllergy = (allergy: string) => {
        setGeneralData({
            ...generalData,
            allergies: [...generalData.allergies, allergy],
        });
    };

    const removeAllergy = (allergyToRemove: string) => {
        setGeneralData({
            ...generalData,
            allergies: generalData.allergies.filter(
                (allergy) => allergy !== allergyToRemove
            ),
        });
    };
    const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const teacherName = e.target.value;
        const teacherNameList = teacherName.split(" ");
        const firstName = teacherNameList[0];
        const lastName = teacherNameList[1];
        setGeneralData({
            ...generalData,
            teacher: {
                firstName,
                lastName,
            },
        });
    };
    return (
        <div className="h-[250px]">
            <div className="grid grid-cols-4 gap-4 w-4xl">
                <TextInput
                    label="First Name:"
                    value={generalData.firstName}
                    name="firstName"
                    onChange={handleChange}
                    disabled={disabled}
                />

                <TextInput
                    label="Last Name:"
                    value={generalData.lastName}
                    name="lastName"
                    onChange={handleChange}
                    disabled={disabled}
                />

                <SelectInput
                    label="School Year:"
                    value={generalData.schoolYear}
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
                        value={generalData.dob}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2"
                        required
                        disabled={disabled}
                    />
                </div>

                <SelectInput
                    label="School Year:"
                    value={generalData.gender}
                    name="gender"
                    options={["Male", "Female"]}
                    onChange={handleChange}
                    disabled={disabled}
                />

                <TextInput
                    label="High School:"
                    value={generalData.highSchool}
                    name="highSchool"
                    onChange={handleChange}
                    disabled={disabled}
                />

                <SelectInput
                    label="Teacher:"
                    value={`${generalData["teacher"]["firstName"]} ${generalData["teacher"]["lastName"]}`}
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
                    allergies={generalData.allergies}
                    addAllergy={addAllergy}
                    removeAllergy={removeAllergy}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
