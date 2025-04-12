import closeModal from "@/utility/closeModal";
import { FormEvent, useState } from "react";
import PermissionsSubForm from "../SubForms/AccountManagementSubForms/PermissionsSubForm";
import InviteSubForm from "../SubForms/AccountManagementSubForms/InviteSubForm";
import Tab from "../Tab";

export default function AccountManagementForm({ staff, setStaff }) {
    const [staffFormState, setStaffFormState] = useState(staff);
    const [tab, setTab] = useState("permissions");
    // actually log the changes to firestore and update local state
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

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
            <form onSubmit={(e) => onSubmit(e)}>
                {/* pass in setState to change permissions */}
                {/* pass in setState to add another if valid */}
                <div className="tabs tabs-lift">
                    <Tab currTab={tab} value="permissions" setTab={setTab}>
                        <PermissionsSubForm />
                    </Tab>
                    <Tab currTab={tab} value="permissions" setTab={setTab}>
                        <InviteSubForm />
                    </Tab>
                </div>
            </form>
        </>
    );
}
