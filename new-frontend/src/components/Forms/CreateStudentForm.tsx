import { FormEvent, useState } from "react";
import GeneralSubForm from "../SubForms/GeneralSubForm";
import PrivateSubForm from "../SubForms/PrivateSubForm";
import validateCreateStudentForm from "@/utility/validateCreateStudentForm";
import closeModal from "@/utility/closeModal";
import {
    generalFormDataDefault,
    privateFormDataDefault,
} from "@/utility/consts";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/utility/firebase";

export default function CreateStudentForm() {
    const [generalFormData, setGeneralFormData] = useState(
        generalFormDataDefault
    );
    const [privateFormData, setPrivateFormData] = useState(
        privateFormDataDefault
    );
    const [tab, setTab] = useState("general");

    const exit = () => {
        setGeneralFormData(generalFormDataDefault);
        setPrivateFormData(privateFormDataDefault);
        closeModal();
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const generalDataDocRef = collection(
            db,
            "directory",
            "afam",
            "student"
        );
        const generalDataDoc = await addDoc(generalDataDocRef, generalFormData);

        const privateDataDocRef = doc(
            db,
            "directory",
            "afam",
            "student",
            generalDataDoc.id,
            "private",
            "data"
        );
        await setDoc(privateDataDocRef, privateFormData);

        exit();
    };

    return (
        <>
            <form method="dialog">
                <button
                    className="btn btn-md btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => resetState()}
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
