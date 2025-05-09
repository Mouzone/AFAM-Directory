import closeModal from "@/utility/closeModal";
import { db } from "@/utility/firebase";
import { StaffObject } from "@/utility/types";
import { doc, writeBatch } from "firebase/firestore";
import { FormEvent, useContext, useEffect, useState } from "react";
import trashcan from "../../../../public/svgs/trashcan.svg";
import Image from "next/image";
import { ToastContext } from "@/components/Providers/ToastProvider";

type PermissionSubFormProps = {
    staff: StaffObject;
};

export default function PermissionsSubForm({ staff }: PermissionSubFormProps) {
    const { setMessage } = useContext(ToastContext)!;
    const [tempStaff, setTempStaff] = useState(staff);
    const [toDelete, setToDelete] = useState<string[]>([]);

    useEffect(() => {
        setTempStaff(staff);
    }, [staff]);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const batch = writeBatch(db);
        Object.entries(tempStaff).map(([staffId, staffData]) => {
            const staffDocRef = doc(db, "directory", "afam", "staff", staffId);
            batch.update(staffDocRef, staffData);
            const userDocRef = doc(db, "user", staffId, "directory", "afam");
            batch.update(userDocRef, staffData);
        });
        toDelete.forEach(async (staffId) => {
            const staffDocRef = doc(db, "directory", "afam", "staff", staffId);
            batch.delete(staffDocRef);

            // // remove directory from the user
            const userDocRef = doc(db, "user", staffId, "directory", "afam");
            batch.delete(userDocRef);
        });
        try {
            await batch.commit();
            setMessage("Accounts successfully altered");
        } catch {
            setMessage("Past of Accounts could not be altered");
        }
        closeModal();
    };

    return (
        <form onSubmit={(e) => onSubmit(e)}>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box h-[400px] overflow-y-auto">
                <legend className="fieldset-legend">Permissions</legend>
                <div className="join join-vertical bg-base-100">
                    {Object.entries(tempStaff).map(
                        ([staffId, staffData]) =>
                            !toDelete.includes(staffId) && (
                                <div
                                    key={staffId}
                                    className="collapse collapse-arrow join-item border-base-300 border"
                                >
                                    <input type="radio" name="my-accordion-4" />
                                    <div className="collapse-title font-semibold">
                                        {`${staffData["First Name"]} ${staffData["Last Name"]} (${staffData["Email"]})`}
                                    </div>
                                    {/* private */}
                                    <div className="collapse-content flex flex-col justify-center gap-4">
                                        <div className=" grid grid-cols-2 sm:gap-4 ml-8 justify-items-center">
                                            <div className="text-sm">
                                                Can access
                                                <span className="font-bold">
                                                    {" "}
                                                    Private
                                                </span>
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
                                                            Private:
                                                                !staffData[
                                                                    "Private"
                                                                ],
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
                                                checked={
                                                    staffData["Manage Accounts"]
                                                }
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
                                        <button
                                            className="btn mx-4"
                                            onClick={() =>
                                                setToDelete([
                                                    ...toDelete,
                                                    staffId,
                                                ])
                                            }
                                            type="button"
                                        >
                                            <Image
                                                src={trashcan}
                                                alt="delete"
                                            />
                                            <div className="text-red-500">
                                                Delete User
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )
                    )}
                </div>
            </fieldset>
            <div className="flex justify-end gap-4 mt-4">
                <button
                    className="btn btn-neutral dark:btn-secondary"
                    type="submit"
                >
                    Submit
                </button>
                <button
                    type="button"
                    className="btn"
                    onClick={() => {
                        setTempStaff(staff);
                        closeModal();
                        setToDelete([]);
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
