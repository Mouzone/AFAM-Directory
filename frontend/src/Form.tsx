import React, { useState, useEffect } from "react";
import { Student, Teacher } from "./types";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    updateDoc,
    getDoc
} from "firebase/firestore";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { db, storage } from "./utility/firebase";
import MainInfo from "./StudentFormComponent/MainInfo";
import HomeInfo from "./StudentFormComponent/HomeInfo";
import GuardianInfo from "./StudentFormComponent/GuardianInfo";
import SelectInput from "./Inputs/SelectInput";
import AllergiesInput from "./Inputs/AllergiesInput";
import Buttons from "./StudentFormComponent/Buttons";

interface FormProps {
    state: Student;
    closeForm: () => void;
    teachers: Teacher[] | undefined;
}

export default function Form({state, closeForm, teachers}: FormProps) {
    const [formData, setFormData] = useState<Student>(state);
    const [isEdit, setIsEdit] = useState(false);

    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const disabled = "id" in formData && !isEdit;

    useEffect(() => {
        if (!formData["id"]) {
            return;
        }
        async function fetchPrivateInfo() {
            // if (!formData["id"]) {
            //   setPrivateInfo(null); // Clear previous data if ID is missing
            //   return;
            // }
      
            const studentRef = doc(db, "students", formData["id"]);
            const privateCollectionRef = collection(studentRef, "private");
            const privateDocRef = doc(privateCollectionRef, "privateInfo");
            const privateDocSnapshot = await getDoc(privateDocRef);
            console.log(privateDocSnapshot.data())
        }
        fetchPrivateInfo()

        const headshotRef = ref(storage, `images/${formData["id"]}`);
        getDownloadURL(headshotRef)
            .then((url) => {
                setImageUrl(url);
            })
            .catch((error) => {
                console.error("Error getting download URL:", error);
            });
    }, []);

    // todo: delete image as well
    const onDelete = () => {
        const docRef = doc(db, "students", formData["id"] as string);
        deleteDoc(docRef)
            .then(() => {
                console.log("Document successfully deleted!");
            })
            .catch((error) => {
                console.error("Error deleting document: ", error);
            });

        const headshotRef = ref(storage, `images/${docRef.id}`);
        deleteObject(headshotRef)
            .then(() => console.log("Image delete", docRef.id))
            .catch((error) => console.error(error));
        closeForm();
    };

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

    const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            home: {
                ...formData["home"],
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleGuardianChange = (guardian: "guardian1" | "guardian2") => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({
                ...formData,
                [guardian]: {
                    ...formData[guardian],
                    [e.target.name]: e.target.value,
                },
            });
        };
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        setImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
        setError(null); // Clear any previous errors
    };

    function uploadImage(id: string) {
        if (!image) {
            return;
        }

        const storageRef = ref(storage, `images/${id}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
            },
            (error) => {
                setError(error.message); // Set the error message
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                    setImage(null); // Clear the selected image after successful upload
                });
            }
        );
    }
    const onSubmit = (formData: Student) => {
        if (!formData["id"]) {
            const colRef = collection(db, "students");
            addDoc(colRef, formData)
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    uploadImage(docRef.id);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        } else {
            const docRef = doc(db, "students", formData["id"]);
            updateDoc(docRef, formData)
                .then(() => {
                    uploadImage(docRef.id);
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        }

        closeForm();
    };

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
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                }
            }}
            noValidate
        >
            <h1 className="text-2xl font-bold mb-4">Student Form</h1>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={disabled}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}{" "}
                {/* Display error message */}
                {imageUrl && (
                    <div>
                        <img
                            src={imageUrl}
                            alt="Uploaded Image"
                            style={{ maxWidth: "300px" }}
                        />
                    </div>
                )}
            </div>

            {/* Grid Layout for Form Fields */}
            <h2 className="text-xl font-bold underline"> Basic Info </h2>
            <div className="grid grid-cols-4 gap-4 w-4xl">
                <MainInfo
                    formData={formData}
                    handleChange={handleMainChange}
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

            <h2 className="text-xl font-bold underline"> Home </h2>
            <div className="grid grid-cols-4 gap-4">
                <HomeInfo
                    home={formData["home"]}
                    handleHomeChange={handleHomeChange}
                    disabled={disabled}
                />
            </div>

            <h2 className="text-xl font-bold underline"> Guardian 1 </h2>
            <div className="grid grid-cols-4 gap-4">
                <GuardianInfo
                    guardian={formData["guardian1"]}
                    onChange={handleGuardianChange("guardian1")}
                    disabled={disabled}
                />
            </div>

            <h2 className="text-xl font-bold underline"> Guardian 2 </h2>
            <div className="grid grid-cols-4 gap-4">
                <GuardianInfo
                    guardian={formData["guardian2"]}
                    onChange={handleGuardianChange("guardian2")}
                    disabled={disabled}
                />
            </div>

            <Buttons
                type={!("id" in formData) ? "add" : "view"}
                isEdit={isEdit}
                onDelete={onDelete}
                setIsEdit={setIsEdit}
                closeForm={closeForm}
            />
        </form>
    );
}
