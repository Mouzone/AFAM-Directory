import closeModal from "@/utility/closeModal";
import { FormEvent, useState } from "react";

export default function AccountManagementForm({ staff }) {
    // actually log the changes to firestore, else do nothing
    const [staffFormState, setStaffFormState] = useState(staff);
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
                <PermissionsSubForm />
                {/* pass in setState to add another if valid */}
                <InviteSubForm />
            </form>
        </>
    );
}
