import React, { useState, useEffect } from "react";
import { StudentGeneralInfo, StudentPrivateInfo, Teacher } from "../../types";
import { collection, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { db, storage } from "@/utility/firebase";
import Buttons from "../FormComponents/Buttons";
import { studentPrivateInfoDefault } from "@/utility/consts";
import General from "../FormComponents/General";
import Private from "../FormComponents/Private";
import Image from "next/image";

interface FormProps {
    generalState: StudentGeneralInfo;
    closeForm: () => void;
    teachers: Teacher[] | undefined;
}

export default function Form({ generalState, closeForm, teachers }: FormProps) {
    const [generalData, setGeneralData] =
        useState<StudentGeneralInfo>(generalState);
    const [privateData, setPrivateData] = useState<StudentPrivateInfo>(
        studentPrivateInfoDefault
    );
    const [tab, setTab] = useState<"general" | "private">("general");
    const [isEdit, setIsEdit] = useState(false);

    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const disabled = "id" in generalData && !isEdit;

    useEffect(() => {
        if (!generalData["id"]) {
            return;
        }
        async function fetchPrivateInfo() {
            const studentRef = doc(db, "students", generalData["id"] as string);
            const privateCollectionRef = collection(studentRef, "private");
            const privateDocRef = doc(privateCollectionRef, "privateInfo");
            const privateDocSnapshot = await getDoc(privateDocRef);
            setPrivateData(privateDocSnapshot.data() as StudentPrivateInfo);
        }

        async function fetchHeadshot() {
            const headshotRef = ref(storage, `images/${generalData["id"]}`);
            const url = await getDownloadURL(headshotRef);
            setImageUrl(url);
        }

        fetchHeadshot();
        fetchPrivateInfo();
    }, [generalData]);

    const onDelete = async () => {
        const docRef = doc(db, "students", generalData["id"] as string);
        const headshotRef = ref(storage, `images/${docRef.id}`);

        await deleteDoc(docRef);
        await deleteObject(headshotRef);

        closeForm();
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

    // runs the same regardless of "add" or "edit" scenario
    const onSubmit = async () => {
        // type "generalData["id"]" as string since, fireStore will autogenerate a new id if it doesnt exist
        const docRef = doc(db, "students", generalData["id"] as string);
        const privateColRef = collection(docRef, "private");
        const privateDocRef = doc(privateColRef, "privateInfo");

        await setDoc(docRef, generalData, { merge: true });
        await setDoc(privateDocRef, privateData, { merge: true });

        uploadImage(docRef.id);
        closeForm();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            !generalData.firstName ||
            !generalData.lastName ||
            !generalData.schoolYear ||
            !generalData.dob ||
            !generalData.gender ||
            !generalData.highSchool ||
            !privateData.phoneNumber ||
            !privateData.email
        ) {
            alert("Please fill out all required fields.");
            return;
        }

        onSubmit();
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
            <div className="flex gap-5">
                <div className="flex flex-col gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={disabled}
                        className={`block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4 file:rounded-md
                            file:border-0 file:text-sm file:font-semibold
                            file:bg-blue-100 file:text-blue-700
                            ${!disabled && "hover:file:bg-blue-100"}`}
                    />
                    
                    {error && <p style={{ color: "red" }}>{error}</p>}{" "}
                    {/* Display error message */}
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Uploaded Image"
                            style={{ maxWidth: "300px" }}
                        />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="300"
                            height="300"
                            viewBox="0 0 100 100"
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "5%",
                                background: "#f0f0f0",
                            }}
                        >
                            <circle cx="50" cy="35" r="20" fill="#bbb" />
                            <path
                                d="M50 65c-20 0-35 10-35 35h70c0-25-15-35-35-35z"
                                fill="#bbb"
                            />
                        </svg>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="flex gap-4 mb-7">
                        <div
                            onClick={() => setTab("general")}
                            className={`cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 ${
                                tab === "general"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            General
                        </div>
                        <div
                            onClick={() => setTab("private")}
                            className={`cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 ${
                                tab === "private"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Private
                        </div>
                    </div>
                    {tab == "general" ? (
                        <General
                            disabled={disabled}
                            teachers={teachers}
                            generalData={generalData}
                            setGeneralData={setGeneralData}
                        />
                    ) : (
                        <Private
                            disabled={disabled}
                            privateData={privateData}
                            setPrivateData={setPrivateData}
                        />
                    )}
                    <Buttons
                        type={!("id" in generalData) ? "add" : "view"}
                        isEdit={isEdit}
                        onDelete={onDelete}
                        setIsEdit={setIsEdit}
                        closeForm={closeForm}
                    />
                </div>
            </div>
        </form>
    );
}
