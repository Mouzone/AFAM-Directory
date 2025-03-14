import { SidebarContextType, Tab } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/utility/firebase";
import { AuthContext } from "../AuthContext";

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export default function Sidebar() {
    const [currentTab, setCurrentTab] = useState<Tab>("Directory");

    return (
        <SidebarContext.Provider value={{ currentTab, setCurrentTab }}>
            <SidebarNav />
        </SidebarContext.Provider>
    );
}
const showAccounts = true;

function SidebarNav() {
    const { user } = useContext(AuthContext);
    const { currentTab, setCurrentTab } = useContext(SidebarContext);

    const showAccounts =
        user &&
        (user.role == "admin" ||
            user.role == "pastor" ||
            user.isWelcomeTeamLeader);

    if (!user) {
        return <></>;
    }

    return (
        <nav className="flex flex-col justify-start pt-20">
            <Link
                href="/directory"
                className={`justify-end ${
                    currentTab === "Directory" ? "font-bold" : ""
                }`}
                onClick={() => setCurrentTab("Directory")}
            >
                Directory
            </Link>
            {showAccounts && (
                <Link
                    href="/accounts"
                    className={`justify-end ${
                        currentTab === "Accounts" ? "font-bold" : ""
                    }`}
                    onClick={() => setCurrentTab("Accounts")}
                >
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
    );
}
