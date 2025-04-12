import { db } from "@/utility/firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";

// todo: add permissions panel here to add for when user is invited, but for now by default set to False and False
export default function InviteSubForm({ email, setEmail, setStaff }) {
    const onClick = async () => {
        if (email === "") {
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
            ...result.data,
            Private: false,
            "Manage Accounts": false,
        };
        await setDoc(newStaffDoc, staffData);

        // add directory to user's available directories
        const directoryRef = doc(db, "user", result.id, "directory", "afam");
        await setDoc(directoryRef, { name: "afam" });

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
