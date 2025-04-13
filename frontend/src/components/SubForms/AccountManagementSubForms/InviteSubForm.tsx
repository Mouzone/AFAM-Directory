import { db } from "@/utility/firebase";
import { Staff, StaffObject } from "@/utility/types";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
type InviteSubFormProps = {
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    setStaff: Dispatch<SetStateAction<StaffObject>>;
};
export default function InviteSubForm({
    email,
    setEmail,
    setStaff,
}: InviteSubFormProps) {
    const onClick = async () => {
        if (email === "") {
            return;
        }

        // if already in staff, do nothing
        const existsInStaffQuery = query(
            collection(db, "directory", "afam", "staff"),
            where("Email", "==", email)
        );
        const existsInStaffSnapshot = await getDocs(existsInStaffQuery);
        if (existsInStaffSnapshot.docs.length === 1) {
            console.log("already exists");
            return;
        }

        // search through users for the email
        // copy info and add it to staff with `Private` and `Manage Accounts` permissions
        const q = query(collection(db, "user"), where("Email", "==", email));
        // will only be one doc, since emails are only allowed to be used once
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length == 0) {
            return;
        }

        // add user to staff
        const result = querySnapshot.docs[0];
        const newStaffDoc = doc(db, "directory", "afam", "staff", result.id);
        const staffData = {
            ...(result.data() as Staff),
            Private: false,
            "Manage Accounts": false,
        };
        await setDoc(newStaffDoc, staffData);

        // add directory to user's available directories
        const directoryRef = doc(db, "user", result.id, "directory", "afam");
        await setDoc(directoryRef, {
            name: "afam",
            Private: false,
            "Manage Accounts": false,
        });

        setStaff((prev) => {
            return {
                ...prev,
                [result.id]: staffData,
            };
        });
    };

    return (
        <div className="join flex justify-center">
            <div>
                <label className="input validator join-item">
                    <svg
                        className="h-[1em] opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <rect
                                width="20"
                                height="16"
                                x="2"
                                y="4"
                                rx="2"
                            ></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                    </svg>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <div className="validator-hint hidden">
                    Enter valid email address
                </div>
            </div>
            <button className="btn btn-neutral join-item" onClick={onClick}>
                Invite
            </button>
        </div>
    );
}
