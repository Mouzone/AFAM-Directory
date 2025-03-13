"use client";
import Link from "next/link";
import { auth } from "@/utility/firebase";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Role } from "@/types";
import { useRouter } from "next/navigation";

type ContentLayoutProps = { children: React.ReactNode };
export default function ContentLayout({ children }: ContentLayoutProps) {
    const [showAccounts, setShowAccounts] = useState(false);
    const router = useRouter();
    useEffect(() => {
        async function getRole() {
            const tokenResult = await auth.currentUser?.getIdTokenResult();
            if (!tokenResult) {
                return router.push("/error");
            }
            const userRole = tokenResult.claims.role as Role;
            // todo: redirect to an error page
            const showAccounts = [
                "pastor",
                "welcome team leader",
                "admin",
            ].includes(userRole);
            setShowAccounts(showAccounts);
        }
        getRole();
    }, []);

    return (
        <div className="flex w-full justify-center gap-9">
            <nav className="flex flex-col justify-start pt-20">
                <Link href="/directory" className="justify-end">
                    Directory
                </Link>
                {showAccounts && (
                    <Link href="/accounts" className="justify-end">
                        Accounts
                    </Link>
                )}
                <button
                    type="button"
                    onClick={() => signOut(auth)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Sign Out
                </button>
            </nav>
            {children}
        </div>
    );
}
