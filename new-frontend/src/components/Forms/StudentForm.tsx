import { FormEvent, useEffect, useState } from "react";
import GeneralSubForm from "../SubForms/GeneralSubForm";
import PrivateSubForm from "../SubForms/PrivateSubForm";
import validateCreateStudentForm from "@/utility/validateCreateStudentForm";
import closeModal from "@/utility/closeModal";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utility/firebase";
import { getPrivateData } from "@/utility/getPrivateData";
import { useQuery } from "@tanstack/react-query";
import Tab from "../Tab";

export default function StudentForm({
    studentId,
    generalFormState,
    privateFormState,
    setDirectory,
    resetState,
}) {
    const [generalFormData, setGeneralFormData] = useState(generalFormState);
    const [privateFormData, setPrivateFormData] = useState(privateFormState);
    const [tab, setTab] = useState("general");
    const { isLoading, data, error } = useQuery({
        queryKey: [studentId, "privateData"],
        queryFn: () => getPrivateData(studentId),
        enabled: studentId !== null,
    });

    useEffect(() => {
        setGeneralFormData(generalFormState);
    }, [generalFormState]);

    useEffect(() => {
        if (data) {
            setPrivateFormData(data);
        }
    }, [studentId, data]);

    const exit = () => {
        setTab("general");
        resetState();
        closeModal();
    };

    const onSubmit = async (
        studentId: string,
        e: FormEvent<HTMLFormElement>
    ) => {
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
            setDirectory((prev) => ({
                ...prev,
                [studentId]: generalFormData,
            }));
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
            setDirectory((prev) => ({
                ...prev,
                [newStudentRef.id]: generalFormData,
            }));
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
            <form onSubmit={(e) => onSubmit(studentId, e)}>
                {/* headshot */}
                <div className="tabs tabs-lift">
                    <Tab currTab={tab} value="general" setTab={setTab}>
                        <GeneralSubForm
                            data={generalFormData}
                            changeData={(field: string, value: string) =>
                                setGeneralFormData({
                                    ...generalFormData,
                                    [field]: value,
                                })
                            }
                        />
                    </Tab>
                    <Tab currTab={tab} value="private" setTab={setTab}>
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
                    </Tab>
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
