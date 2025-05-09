"use client";

import { AuthContext } from "@/components/Providers/AuthProvider";
import ToastProvider from "@/components/Providers/ToastProvider";
import { auth, db } from "@/utility/firebase";
import { signOut } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ReactNode, useContext, useEffect } from "react";

export default function SignedInLayout({ children }: { children: ReactNode }) {
    const user = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            // User is not authenticated
            router.push("/");
            return;
        }

        if (user) {
            const directoryRef = collection(db, "user", user.uid, "directory");
            const afamDocRef = doc(directoryRef, "afam");

            // First check if "afam" exists
            getDoc(afamDocRef).then((docSnap) => {
                if (!docSnap.exists()) {
                    // No afam doc, redirect to /directory
                    router.push("/directory");
                } else {
                    // Set up listener to redirect to /directory/afam if "afam" doc appears/updates
                    const unsubscribe = onSnapshot(directoryRef, (snapshot) => {
                        snapshot.docChanges().forEach((change) => {
                            if (change.doc.id === "afam") {
                                router.push("/directory/afam");
                            }
                        });
                    });

                    return () => unsubscribe();
                }
            });
        }
    }, [user]);

    if (!user) {
        return (
            <div className="w-full h-screen flex justify-center align-middle">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end">
                {/* <DirectoryNavigation
                    directories={directories}
                    router={router}
                /> */}
                <div className="avatar avatar-placeholder dropdown dropdown-hover dropdown-end p-4">
                    <div className="bg-neutral text-neutral-content w-8 rounded-full">
                        <span className="text-2xl">
                            {user.displayName?.at(0)}
                        </span>
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-50 p-2 shadow-sm mt-8 mr-4"
                    >
                        <li>
                            <div>{user.displayName}</div>
                        </li>
                        <li>
                            <div>{user.email}</div>
                        </li>
                        <li>
                            <a
                                className="text-red-400"
                                onClick={() => {
                                    signOut(auth);
                                }}
                            >
                                Sign Out
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <ToastProvider>{children}</ToastProvider>
        </>
    );
}
