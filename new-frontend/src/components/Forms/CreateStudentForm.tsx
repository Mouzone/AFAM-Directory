import { useState } from "react";
import GeneralSubForm from "../SubForms/GeneralSubForm";
import PrivateSubForm from "../SubForms/PrivateSubForm";

export default function CreateStudentForm() {
    // state has both public and contact fields
    // state has tab to be selected
    // onSubmit write to fireStore
    const [generalFormData, setGeneralFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        birthday: new Date().toISOString().split("T")[0],
        highSchool: "",
        grade: "",
        teacher: "",
    });
    const [privateFormData, setPrivateFormData] = useState({});

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
                        changeData={setPrivateFormData}
                    />
                </div>
            </div>
            {/* submit + cancel */}
        </form>
    );
}
