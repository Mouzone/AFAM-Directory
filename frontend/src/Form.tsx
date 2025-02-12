import React, { useState } from "react";
import { Student, Teacher, HomeKeys } from "./types";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./utility/firebase";
import MainInfo from "./StudentFormComponent/MainInfo";
import HomeInfo from "./StudentFormComponent/HomeInfo";
import GuardianInfo from "./StudentFormComponent/GuardianInfo";
import SelectInput from "./Inputs/SelectInput";
import AllergiesInput from "./Inputs/AllergiesInput"
import Buttons from "./StudentFormComponent/Buttons";

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

	const handleMainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData({
	  		...formData,
	  		[name]: value,
		});
  	};

    const addAllergy = (allergy: string) => {
        setFormData({
            ...formData,
            allergies: [...formData.allergies, allergy]
        })
    }

    const removeAllergy = (allergyToRemove: string) => {
        setFormData({
            ...formData,
            allergies: formData.allergies.filter(allergy => allergy !== allergyToRemove)
        })
    }

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
                <MainInfo formData={formData} handleChange={handleMainChange} disabled={disabled}/>
                <AllergiesInput
                    allergies={formData.allergies}
                    addAllergy={addAllergy}
                    removeAllergy={removeAllergy}
                    disabled={disabled}
                />
                <HomeInfo home={formData["home"]} handleHomeChange={handleHomeChange} disabled={disabled}/>

                <GuardianInfo 
                    title="Primary Contact" 
                    guardian={formData["guardian1"]} 
                    onChange={handleGuardianChange("guardian1")}
                    disabled={disabled}
                />
                <GuardianInfo 
                    title="Secondary Contact"
                    guardian={formData["guardian2"]} 
                    onChange={handleGuardianChange("guardian2")} 
                    disabled={disabled}
                />

                <SelectInput
                    label="Teacher:"
                    value={`${formData["teacher"]["firstName"]} ${formData["teacher"]["lastName"]}`}
                    options={teachers ? teachers.map(teacher => `${teacher["firstName"]} ${teacher["lastName"]}`) : []}
                    onChange={handleTeacherChange}
                    disabled={disabled}
                />
            </div>
            <Buttons type={!("id" in formData)  ? "add" : "view"} isEdit={isEdit} onDelete={onDelete} setIsEdit={setIsEdit} closeForm={closeForm}/>
        </form>
  );
}