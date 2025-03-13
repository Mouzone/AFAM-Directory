"use client";
import Link from "next/link";
import { auth } from "@/utility/firebase";
import { signOut } from "firebase/auth";
import React from "react";

type ContentLayoutProps = { children: React.ReactNode };
export default function ContentLayout({ children }: ContentLayoutProps) {
    return (
        <div className="flex w-full justify-center gap-9">
            <nav className="flex flex-col justify-start pt-20">
                <Link href="/accounts" className="justify-end">
                    Accounts
                </Link>
                <button
                    type="button"
                    onClick={() => signOut(auth)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" // Tailwind styles
                >
                    Sign Out
                </button>
            </nav>
            {children}
        </div>
    );
}
