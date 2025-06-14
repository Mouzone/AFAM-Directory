import closeModal from "@/utility/closeModal";
import { useEffect, useState } from "react";
import PermissionsSubForm from "../SubForms/AccountManagementSubForms/PermissionsSubForm";
import InviteSubForm from "../SubForms/AccountManagementSubForms/InviteSubForm";
import Tab from "../Tab";
import { StaffObject } from "@/utility/types";

type AccountManagementFormProps = {
    staff: StaffObject;
};
export default function AccountManagementForm({
    staff,
}: AccountManagementFormProps) {
    const [tab, setTab] = useState("permissions");
    const [email, setEmail] = useState("");

    useEffect(() => {
        setEmail("");
    }, [tab]);
    return (
        <>
            <form method="dialog">
                <button
                    className="btn btn-md btn-circle btn-ghost absolute right-2 top-2 dark:btn-secondary"
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
                        <PermissionsSubForm staff={staff} />
                    </Tab>
                    <Tab currTab={tab} value="invite" setTab={setTab}>
                        <InviteSubForm email={email} setEmail={setEmail} />
                    </Tab>
                </div>
            </div>
        </>
    );
}
