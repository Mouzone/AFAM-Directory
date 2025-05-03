"use client";

import { AuthContext } from "@/components/Providers/AuthProvider";
import { db } from "@/utility/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Page() {
    const user = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const directoryQuery = collection(
                db,
                "user",
                user.uid,
                "directory"
            );

            // redirects user the moment afam is detected in their directories
            return onSnapshot(directoryQuery, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.doc.id === "afam") {
                        router.push("/directory/afam");
                    }
                });
            });
        }
    }, [user]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                No directories... Ask your administrator to invite you
            </div>
        </div>
    );
}
