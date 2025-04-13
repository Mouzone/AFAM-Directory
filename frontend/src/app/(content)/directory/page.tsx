"use client";

import { AuthContext } from "@/components/Providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Page() {
    const { user, directories } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (
            directories &&
            directories.filter((directory) => directory.name === "afam")
        ) {
            router.push("/directory/afam");
        }
    }, [directories]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                No directories... Ask your administrator to invite you
            </div>
        </div>
    );
}
