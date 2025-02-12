import React, { SetStateAction, useState } from "react";
import { Student, Teacher, HomeKeys, GuardianKeys } from "./types";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./utility/firebase";

export default function Form({ state, closeForm, teachers }: {state: Student, closeForm: () => void, teachers: Teacher[] | undefined}) {
    const [formData, setFormData] = useState<Student>(state);
	const [isEdit, setIsEdit] = useState(false)

    const disabled = "id" in formData && !isEdit

	const onSubmit = (formData: Student) => {
        if (!formData["id"]){
            const colRef = collection(db, "students")
            addDoc(colRef, formData)
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id)
                })
                .catch((error) => {
                    console.error("Error adding document: ", error)
                })
        } else {
            const docRef = doc(db, "students", formData["id"])
            updateDoc(docRef, formData)
                .then(() => {
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        }

        closeForm()
	}

    const onDelete = () => {
        const docRef = doc(db, "students", formData["id"] as string)
        deleteDoc(docRef)
            .then(() => {
                console.log("Document successfully deleted!");
            })
            .catch((error) => {
                console.error("Error deleting document: ", error);
            });
        closeForm()
    }

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData({
	  		...formData,
	  		[name]: value,
		});
  	};

    const handleHomeChange = (field: HomeKeys) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({
                ...formData,
                home: {
                    ...formData["home"],
                    [field]: e.target.value
                }
            })
        }
    }

    const handleGuardianChange = (guardian: "guardian1" | "guardian2") => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({
                ...formData,
                [guardian]: {
                    ...formData[guardian],
                    [e.target.name]: e.target.value
                }
            })
        }
    }

    const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const teacherName = e.target.value
        const teacherNameList = teacherName.split(" ")
        const firstName = teacherNameList[0]
        const lastName = teacherNameList[1]
        setFormData({
            ...formData,
            teacher: {
                firstName,
                lastName
            }
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	    e.preventDefault();
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.schoolYear ||
            !formData.dob ||
            !formData.gender ||
            !formData.highSchool ||
            !formData.phoneNumber ||
            !formData.email 
        ) {
            alert("Please fill out all required fields.");
            return;
        }
	    
        onSubmit(formData);
    };
  
    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-h-[80vh] overflow-y-auto p-4"
            noValidate
        >
            <h2 className="text-xl font-bold mb-4">Student Form</h2>

            {/* Grid Layout for Form Fields */}
            <div className="grid grid-cols-2 gap-4">
                <MainInfo formData={formData} handleChange={handleChange} disabled={disabled}/>
                <HomeInfo home={formData["home"]} handleHomeChange={handleHomeChange} disabled={disabled}/>

                <Contact 
                    title="Primary Contact" 
                    guardian={formData["guardian1"]} 
                    onChange={handleGuardianChange("guardian1")}
                    disabled={disabled}
                />
                <Contact 
                    title="Secondary Contact"
                    guardian={formData["guardian2"]} 
                    onChange={handleGuardianChange("guardian2")} 
                    disabled={disabled}
                />

                {/* AFAM Teacher*/}
                <div className="flex flex-col">
                    <label className="font-bold">Teacher</label>
                    <select
                        name="teacher"
                        value={`${formData["teacher"]["firstName"]} ${formData["teacher"]["lastName"]}`}
                        onChange={handleTeacherChange}
                        className="border border-gray-300 rounded p-2"
                        required
                        disabled={disabled}
                    >
                        <option value="">Select</option>
                        {
                            teachers && teachers.map((teacher, index) => {
                                return <option key={index} value={`${teacher["firstName"]} ${teacher["lastName"]}`}>
                                    {teacher["firstName"]} {teacher["lastName"]}
                                </option>
                            })
                        }
                    </select>
                </div>
            </div>
            <Buttons type={!("id" in formData)  ? "add" : "view"} isEdit={isEdit} onDelete={onDelete} setIsEdit={setIsEdit} closeForm={closeForm}/>
        </form>
  );
}

function MainInfo({formData, handleChange, disabled}: {formData: Student, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, disabled: boolean}){
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

function HomeInfo({home, handleHomeChange, disabled}: {home: Student["home"], handleHomeChange: (field: HomeKeys) => (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean}){
    const titleMap: Record<HomeKeys, string> = {
        "streetAddress": "Street Address:",
        "city": "City",
        "zipCode": "Zip Code"
    }
    return (
        <>
            {
                Object.entries(titleMap).map(([key, value]) => {
                    return (
                        <TextInput
                            label={value}
                            value={home[key as HomeKeys]}
                            onChange={handleHomeChange(key as HomeKeys)}
                            disabled={disabled}
                        />)
                    })
            }
        </>
    )
}

function Contact({title, guardian, disabled, onChange}: {title: string, guardian: {firstName: string, lastName: string, phoneNumber: string, email: string}, disabled: boolean, onChange: (e:React.ChangeEvent<HTMLInputElement>) => void}) {
    return (
        <>
            <TextInput
                label={`${title} First Name:`}
                value={guardian.firstName}
                onChange={onChange}
                disabled={disabled}
            />

            <TextInput
                label={`${title} Last Name:`}
                value={guardian.lastName}
                onChange={onChange}
                disabled={disabled}
            />

            <PhoneInput
                label={`${title} Phone:`}
                value={guardian.phoneNumber}
                onChange={onChange}
                disabled={disabled}
            />

            <EmailInput
                label={`${title} Email:`}
                value={guardian.email}
                onChange={onChange}
                disabled={disabled}
            />
        </>
    )
}

function TextInput({label, value, onChange, disabled}: {label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean}){
    return (
        <div className="flex flex-col">
                <label className="font-bold">{label}</label>
                <input
                    type="text"
                    name="firstName"
                    value={value}
                    onChange={onChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>
    )
}

function PhoneInput({label, value, onChange, disabled}: {label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean}){
    return (
        <div className="flex flex-col">
            <label className="font-bold">{label}</label>
            <input
                type="tel"
                name="primaryContactPhone"
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded p-2"
                required
                disabled={disabled}
            />
        </div>
    )
}

function EmailInput({label, value, onChange, disabled}: {label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean}) {
    return (
        <div className="flex flex-col">
            <label className="font-bold">{label}</label>
            <input
                type="email"
                name="primaryContactEmail"
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded p-2"
                required
                disabled={disabled}
            />
        </div>
    )
}

function SelectInput({label, value, options, onChange, disabled}: {label: string, value: string, options: string[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, disabled: boolean}) {
    return (
        <div className="flex flex-col">
            <label className="font-bold">{label}</label>
            <select
                name="schoolYear"
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded p-2"
                required
                disabled={disabled}
            >
                <option value="">Select</option>
                {
                    options.map(option => <option value={option} key={option}>{option}</option>)
                }
            </select>
        </div>
    )
}
function Buttons({type, isEdit, onDelete, setIsEdit, closeForm}: {type: "add" | "view", isEdit: boolean, onDelete: () => void, setIsEdit: React.Dispatch<SetStateAction<boolean>>, closeForm: () => void}) {
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); 
        setIsEdit(true)
    }
    
	return (
		<div className="sticky bottom-0 bg-white py-4 flex gap-4">
			{ 
				(type === "add" || isEdit)
				?  (<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					Submit
				</button> )
				: (<>
                    <button
                        type="button"
                        onClick={onClick}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Edit
                    </button> 
                    <button
                        type="button"
                        onClick={onDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete
                    </button> 
                </>
                )
			}
			
			<button
				type="button"
				onClick={closeForm}
				className="bg-white border-2 px-3 py-2 rounded hover:bg-gray-300"
			>
				Cancel
			</button>
	  </div>
	)
}