"use client";

import { AuthContext } from "@/components/Providers/AuthProvider";
import { auth } from "@/utility/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function SignedInLayout({ children }) {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    if (!user) {
        return <></>;
    }
    return (
        <>
            <div className="flex justify-end">
                <div className="avatar avatar-placeholder dropdown dropdown-hover dropdown-end p-4">
                    <div className="bg-neutral text-neutral-content w-8 rounded-full">
                        <span className="text-2xl">
                            {user.displayName.at(0)}
                        </span>
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-sm mt-8"
                    >
                        <li>
                            <div>{user.displayName}</div>
                        </li>
                        <li>
                            <a
                                className="text-red-400"
                                onClick={() => {
                                    signOut(auth);
                                    router.push("/");
                                }}
                            >
                                Sign Out
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {children}
        </>
    );
}
