import closeModal from "@/utility/closeModal";
import { Dispatch, SetStateAction, useState } from "react";
import PermissionsSubForm from "../SubForms/AccountManagementSubForms/PermissionsSubForm";
import InviteSubForm from "../SubForms/AccountManagementSubForms/InviteSubForm";
import Tab from "../Tab";
import { StaffObject } from "@/utility/types";

type AccountManagementFormProps = {
    staff: StaffObject;
    setStaff: Dispatch<SetStateAction<StaffObject | null>>;
};
export default function AccountManagementForm({
    staff,
    setStaff,
}: AccountManagementFormProps) {
    const [tab, setTab] = useState("permissions");
    const [email, setEmail] = useState("");

    return (
        <>
            <form method="dialog">
                <button
                    className="btn btn-md btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => {
                        setEmail("");
                        closeModal();
                        setTab("permissions");
                    }}
                >
                    ✕
                </button>
            </form>
            <div>
                <div className="tabs tabs-lift">
                    <Tab currTab={tab} value="permissions" setTab={setTab}>
                        <PermissionsSubForm staff={staff} setStaff={setStaff} />
                    </Tab>
                    <Tab currTab={tab} value="invite" setTab={setTab}>
                        <InviteSubForm
                            email={email}
                            setEmail={setEmail}
                            setStaff={setStaff}
                        />
                    </Tab>
                </div>
            </div>
        </>
    );
}
