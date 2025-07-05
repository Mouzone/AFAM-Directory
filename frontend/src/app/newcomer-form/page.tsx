'use client'
import Tab from "@/components/Tab"
import GeneralSubForm from "@/components/SubForms/StudentSubForms/GeneralSubForm";
import PrivateSubForm from "@/components/SubForms/StudentSubForms/PrivateSubForm";
import { FormEvent, useRef, useState } from "react";
import { generalFormDataDefault, privateFormDataDefault } from "@/utility/consts";
import { StudentPrivateInfo } from "@/utility/types";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/utility/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import validateCreateStudentForm from "@/utility/validateCreateStudentForm";

export default function Page(){
    const [tab, setTab] = useState("general");
    const [generalFormData, setGeneralFormData] = useState(generalFormDataDefault);
    const [privateFormData, setPrivateFormData] = useState<StudentPrivateInfo>(
        privateFormDataDefault
    );
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [resetCounter, setResetCounter] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [isError, setIsError] = useState(false);

    const onSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        // Create new student

        const newStudentRef = await addDoc(
            collection(db, "directory", "afam", "student"),
            generalFormData
        );

        try {
            await updateDoc(newStudentRef, { Id: newStudentRef.id });
            await setDoc(
                doc(newStudentRef, "private", "data"),
                privateFormData
            );

            if (file) {
                const storageRef = ref(
                    storage,
                    `images/${newStudentRef.id}`
                );
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Track upload progress (optional)
                        const progress =
                            (snapshot.bytesTransferred /
                                snapshot.totalBytes) *
                            100;
                        console.log(`Upload progress: ${progress}%`);
                    },
                    (error) => {
                        console.error("Upload failed:", error);
                    },
                    async () => {
                        // Upload completed: Get the public URL
                        const downloadURL = await getDownloadURL(
                            uploadTask.snapshot.ref
                        );

                        // Store the URL in your form data
                        generalFormData["Headshot URL"] = downloadURL;
                        await updateDoc(newStudentRef, {
                            "Headshot URL": downloadURL,
                        });
                    }
                );
            }
            setIsSubmitting(false)
            setSubmitStatus(true)
        } catch {
            setIsSubmitting(false)
            setSubmitStatus(true)
            setIsError(true)
        }
    };

    return (
        <>
        {!submitStatus && !isError ?
        <form onSubmit={(e) => onSubmit(e)} className="w-md">
            <div className="tabs tabs-lift">
                <Tab currTab={tab} value="general" setTab={setTab}>
                    <GeneralSubForm
                        data={generalFormData}
                        setGeneralFormData={setGeneralFormData}
                        setFile={setFile}
                        fileInputRef={fileInputRef}
                        resetCounter={resetCounter}
                    />
                </Tab>
                <Tab currTab={tab} value="private" setTab={setTab}>
                    <PrivateSubForm
                        data={privateFormData}
                        setPrivateFormData={setPrivateFormData}
                    />
                </Tab>
            </div>
            <div
                className={`flex justify-end gap-4 mt-4 ${
                    tab !== "attendance" ? "pb-6" : ""
                }`}
            >
                <button
                    className="btn btn-neutral dark:btn-secondary"
                    type="submit"
                    disabled={
                        !validateCreateStudentForm(
                            generalFormData,
                            privateFormData
                        )
                    }
                    onClick={(e) =>
                        setIsSubmitting(true)
                    }
                >
                    {
                        isSubmitting 
                        ? <span className="loading loading-spinner loading-md"></span>
                        : "Submit" }
                </button>
            </div>
        </form>
        :

        <div className="flex items-center justify-center h-screen w-full">
            {
                submitStatus && !isError &&
                <div>
                    Success! You can close this tab now.
                </div>
            }

            {
                isError && 
                <div> 
                    Error. Notify Pastor Sang or Miss Rachael about the error
                </div>
            }
        </div> 

        }
        </>
    )
}