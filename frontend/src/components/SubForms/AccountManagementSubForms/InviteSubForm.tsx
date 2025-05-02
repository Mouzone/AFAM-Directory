import { inviteStaff } from "@/utility/cloudFunctions";
import { db } from "@/utility/firebase";
import { Staff, StaffObject } from "@/utility/types";
import { useMutation } from "@tanstack/react-query";
import {
    collection,
    doc,
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
    const { isPending, isSuccess, mutate, error } = useMutation({
        mutationFn: async (email: string) => inviteStaff(email),
    });

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
            <button
                className="btn btn-neutral join-item dark:btn-secondary"
                onClick={() => mutate(email)}
            >
                {isPending ? (
                    <span className="loading loading-spinner loading-md"></span>
                ) : (
                    <span> Invite</span>
                )}
            </button>
            {error && <span className="text-red-400"> {error.message} </span>}
            {isSuccess && (
                <span className="text-green-400">
                    {" "}
                    User successfully invited{" "}
                </span>
            )}
        </div>
    );
}
