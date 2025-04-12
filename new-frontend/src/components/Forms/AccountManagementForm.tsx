import closeModal from "@/utility/closeModal";
import { FormEvent, useState } from "react";
import PermissionsSubForm from "../SubForms/AccountManagementSubForms/PermissionsSubForm";
import InviteSubForm from "../SubForms/AccountManagementSubForms/InviteSubForm";
import Tab from "../Tab";

export default function AccountManagementForm({ staff, setStaff }) {
    const [tab, setTab] = useState("permissions");

    return (
        <>
            <form method="dialog">
                <button
                    className="btn btn-md btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => closeModal()}
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
                        <InviteSubForm setStaff={setStaff} />
                    </Tab>
                </div>
            </div>
        </>
    );
}
