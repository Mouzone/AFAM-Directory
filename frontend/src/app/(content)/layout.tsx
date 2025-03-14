"use client";
import { auth } from "@/utility/firebase";
import React, { useEffect, useState } from "react";
import { Role } from "@/types";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/DirectoryComponents/Sidebar";

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
            const isWelcomeTeamLeader =
                (tokenResult.claims.isWelcomeTeamLeader as boolean) || false;
            // todo: redirect to an error page
            const showAccounts =
                ["pastor", "admin"].includes(userRole) || isWelcomeTeamLeader;
            setShowAccounts(showAccounts);
        }
        getRole();
    }, [router]);

    return (
        <div className="flex w-full justify-center gap-9">
            <Sidebar />
            {children}
        </div>
    );
}
