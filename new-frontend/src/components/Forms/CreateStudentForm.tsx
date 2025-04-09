import { useState } from "react";
import GeneralSubForm from "../SubForms/GeneralSubForm";
import PrivateSubForm from "../SubForms/PrivateSubForm";
import validateCreateStudentForm from "@/utility/validateCreateStudentForm";
import closeModal from "@/utility/closeModal";

export default function CreateStudentForm() {
    const [generalFormData, setGeneralFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        birthday: new Date().toISOString().split("T")[0],
        highSchool: "",
        grade: "",
        teacher: "",
    });
    const [privateFormData, setPrivateFormData] = useState({
        personal: {
            streetAddress: "",
            city: "",
            zipCode: "",
            phone: "",
            email: "",
        },
        guardian1: { firstName: "", lastName: "", phone: "", email: "" },
        guardian2: { firstName: "", lastName: "", phone: "", email: "" },
    });

    const [tab, setTab] = useState("general");

    return (
        <form>
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
                            person: "personal" | "guardian1" | "guardian2",
                            field: string,
                            value: string
                        ) =>
                            setPrivateFormData({
                                personal: { ...privateFormData["personal"] },
                                guardian1: { ...privateFormData["guardian1"] },
                                guardian2: { ...privateFormData["guardian2"] },
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
                    disabled={validateCreateStudentForm(
                        generalFormData,
                        privateFormData
                    )}
                >
                    Submit
                </button>
                <button
                    type="button"
                    className="btn"
                    onClick={() => closeModal()}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
