import { FormEvent, useEffect, useState } from "react";
import GeneralSubForm from "../SubForms/GeneralSubForm";
import PrivateSubForm from "../SubForms/PrivateSubForm";
import validateCreateStudentForm from "@/utility/validateCreateStudentForm";
import closeModal from "@/utility/closeModal";
import {
    generalFormDataDefault,
    privateFormDataDefault,
} from "@/utility/consts";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utility/firebase";

export default function StudentForm({
    studentIdState,
    generalFormState,
    privateFormState,
}) {
    const [studentId, setStudentId] = useState(studentIdState);
    const [generalFormData, setGeneralFormData] = useState(generalFormState);
    const [privateFormData, setPrivateFormData] = useState(privateFormState);
    const [tab, setTab] = useState("general");

    useEffect(() => {
        setStudentId(studentId);
    }, [studentIdState]);

    useEffect(() => {
        setGeneralFormData(generalFormState);
    }, [generalFormState]);

    useEffect(() => {
        setPrivateFormData(privateFormState);
    }, [privateFormState]);

    const exit = () => {
        setTab("general");
        setGeneralFormData(generalFormDataDefault);
        setPrivateFormData(privateFormDataDefault);
        closeModal();
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (studentId) {
            // Edit existing student
            const studentRef = doc(
                db,
                "directory",
                "afam",
                "student",
                studentId
            );
            await Promise.all([
                updateDoc(studentRef, generalFormData),
                updateDoc(doc(studentRef, "private", "data"), privateFormData),
            ]);
        } else {
            // Create new student
            const newStudentRef = await addDoc(
                collection(db, "directory", "afam", "student"),
                generalFormData
            );
            await setDoc(
                doc(newStudentRef, "private", "data"),
                privateFormData
            );
        }

        exit();
    };

    return (
        <>
            <form method="dialog">
                <button
                    className="btn btn-md btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => exit()}
                >
                    ✕
                </button>
            </form>
            <form onSubmit={(e) => onSubmit(e)}>
                {/* headshot */}
                <div className="tabs tabs-lift">
                    <input
                        type="radio"
                        name="general"
                        className="tab"
                        aria-label="General"
                        checked={tab === "general"}
                        onChange={() => setTab("general")}
                    />
                    <div className="tab-content bg-base-100 border-base-300 p-6">
                        <GeneralSubForm
                            data={generalFormData}
                            changeData={(field: string, value: string) =>
                                setGeneralFormData({
                                    ...generalFormData,
                                    [field]: value,
                                })
                            }
                        />
                    </div>
                    <input
                        type="radio"
                        name="private"
                        className="tab"
                        aria-label="Private"
                        checked={tab === "private"}
                        onChange={() => setTab("private")}
                    />
                    <div className="tab-content bg-base-100 border-base-300 p-6">
                        <PrivateSubForm
                            data={privateFormData}
                            changeData={(
                                person:
                                    | "Personal"
                                    | "Guardian 1"
                                    | "Guardian 2",
                                field: string,
                                value: string
                            ) =>
                                setPrivateFormData({
                                    Personal: {
                                        ...privateFormData["Personal"],
                                    },
                                    "Guardian 1": {
                                        ...privateFormData["Guardian 1"],
                                    },
                                    "Guardian 2": {
                                        ...privateFormData["Guardian 2"],
                                    },
                                    [person]: {
                                        ...privateFormData[person],
                                        [field]: value,
                                    },
                                })
                            }
                        />
                    </div>
                </div>
                <div
                    className={`flex justify-end gap-4 mt-4 ${
                        tab === "private" ? "pb-6" : ""
                    }`}
                >
                    <button
                        className="btn btn-neutral"
                        type="submit"
                        disabled={
                            !validateCreateStudentForm(
                                generalFormData,
                                privateFormData
                            )
                        }
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => exit()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}
