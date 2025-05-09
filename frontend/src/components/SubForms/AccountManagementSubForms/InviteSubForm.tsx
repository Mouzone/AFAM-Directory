import { inviteStaff } from "@/utility/cloudFunctions";
import { useMutation } from "@tanstack/react-query";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
type InviteSubFormProps = {
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
};
export default function InviteSubForm({ email, setEmail }: InviteSubFormProps) {
    const { isPending, isSuccess, mutate, error, reset } = useMutation({
        mutationFn: async (email: string) => inviteStaff({ email }),
    });

    useEffect(() => {
        reset();
    }, [email]);

    return (
        <div className="flex flex-col">
            <form
                className="join flex justify-center"
                onSubmit={(e) => {
                    e.preventDefault();
                    mutate(email);
                }}
            >
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
                    type="submit"
                >
                    {isPending ? (
                        <span className="loading loading-spinner loading-md"></span>
                    ) : (
                        <span> Invite</span>
                    )}
                </button>
            </form>
            {error && (
                <span className="text-red-400 text-xs text-center">
                    {error.message}
                </span>
            )}
            {isSuccess && (
                <span className="text-green-400 text-xs text-center">
                    User successfully invited
                </span>
            )}
        </div>
    );
}
