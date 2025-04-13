import closeModal from "@/utility/closeModal";
import { db } from "@/utility/firebase";
import { StaffObject } from "@/utility/types";
import { doc, writeBatch } from "firebase/firestore";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

type PermissionSubFormProps = {
    staff: StaffObject;
    setStaff: Dispatch<SetStateAction<StaffObject>>;
};

export default function PermissionsSubForm({
    staff,
    setStaff,
}: PermissionSubFormProps) {
    const [tempStaff, setTempStaff] = useState(staff);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const batch = writeBatch(db);
        Object.entries(tempStaff).map(([staffId, staffData]) => {
            const staffDocRef = doc(db, "directory", "afam", "staff", staffId);
            batch.update(staffDocRef, staffData);
        });
        await batch.commit();
        setStaff(tempStaff);
        closeModal();
    };

    return (
        <form onSubmit={(e) => onSubmit(e)}>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Permissions</legend>
                <div className="join join-vertical bg-base-100">
                    {Object.entries(tempStaff).map(([staffId, staffData]) => (
                        <div
                            key={staffId}
                            className="collapse collapse-arrow join-item border-base-300 border"
                        >
                            <input type="radio" name="my-accordion-4" />
                            <div className="collapse-title font-semibold">
                                {`${staffData["First Name"]} ${staffData["Last Name"]} (${staffData["Email"]})`}
                            </div>
                            {/* private */}
                            <div className="collapse-content grid grid-cols-2 gap-4 ml-8">
                                <div className="text-sm">
                                    Can access
                                    <span className="font-bold"> Private</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle"
                                    checked={staffData["Private"]}
                                    onChange={() =>
                                        setTempStaff({
                                            ...staff,
                                            [staffId]: {
                                                ...staffData,
                                                Private: !staffData["Private"],
                                            },
                                        })
                                    }
                                />
                                <div className="text-sm">
                                    Can invite other accounts
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle"
                                    checked={staffData["Manage Accounts"]}
                                    onChange={() =>
                                        setTempStaff({
                                            ...staff,
                                            [staffId]: {
                                                ...staffData,
                                                "Manage Accounts":
                                                    !staffData[
                                                        "Manage Accounts"
                                                    ],
                                            },
                                        })
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </fieldset>
            <div className="flex justify-end gap-4 mt-4">
                <button className="btn btn-neutral" type="submit">
                    Submit
                </button>
                <button
                    type="button"
                    className="btn"
                    onClick={() => {
                        setTempStaff(staff);
                        closeModal();
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
