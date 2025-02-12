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
            {/* First Name */}
            <div className="flex flex-col">
                <label className="font-bold">First Name:</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
                <label className="font-bold">Last Name:</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

            {/* School Year */}
            <div className="flex flex-col">
                <label className="font-bold">School Year:</label>
                <select
                    name="schoolYear"
                    value={formData.schoolYear}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                >
                    <option value="">Select</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>
            </div>

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

            {/* Gender */}
            <div className="flex flex-col">
                <label className="font-bold">Gender:</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            {/* High School */}
            <div className="flex flex-col">
                <label className="font-bold">High School:</label>
                <input
                    type="text"
                    name="highSchool"
                    value={formData.highSchool}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
                <label className="font-bold">Phone Number:</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

            {/* Email */}
            <div className="flex flex-col">
                <label className="font-bold">Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

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

function HomeInfo({home, handleHomeChange, disabled}: {home: {streetAddress: string, city: string, zipCode: string}, handleHomeChange: (field: HomeKeys) => (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean}){
    return (
        <>
            {/* Street Address */}
            <div className="flex flex-col">
                <label className="font-bold">Street Address:</label>
                <input
                    type="text"
                    name="streetAddress"
                    value={home.streetAddress}
                    onChange={handleHomeChange("streetAddress")}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

            {/* City */}
            <div className="flex flex-col">
                <label className="font-bold">City:</label>
                <input
                    type="text"
                    name="city"
                    value={home.city}
                    onChange={handleHomeChange("city")}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

            {/* Zip Code */}
            <div className="flex flex-col">
                <label className="font-bold">Zip Code:</label>
                <input
                    type="text"
                    name="zipCode"
                    value={home.zipCode}
                    onChange={handleHomeChange("zipCode")}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>
        </>
    )
}

function Contact({title, guardian, disabled, onChange}: {title: string, guardian: {firstName: string, lastName: string, phoneNumber: string, email: string}, disabled: boolean, onChange: (e:React.ChangeEvent<HTMLInputElement>) => void}) {
    return (
        <>
            <div className="flex flex-col">
                <label className="font-bold">{title} First Name:</label>
                <input
                    type="text"
                    name="firstName"
                    value={guardian.firstName}
                    onChange={onChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

            <div className="flex flex-col">
                <label className="font-bold">{title} Last Name:</label>
                <input
                    type="text"
                    name="lastName"
                    value={guardian.lastName}
                    onChange={onChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

            {/* Primary Contact Phone */}
            <div className="flex flex-col">
                <label className="font-bold">{title} Phone:</label>
                <input
                    type="tel"
                    name="primaryContactPhone"
                    value={guardian.phoneNumber}
                    onChange={onChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>

            {/* Primary Contact Email */}
            <div className="flex flex-col">
                <label className="font-bold">{title} Email:</label>
                <input
                    type="email"
                    name="primaryContactEmail"
                    value={guardian.email}
                    onChange={onChange}
                    className="border border-gray-300 rounded p-2"
                    required
                    disabled={disabled}
                />
            </div>
        </>
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