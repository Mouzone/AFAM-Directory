"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../../utility/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Directory, AuthUser } from "../../utility/types";

export const AuthContext = createContext<AuthUser>({
    user: null,
    directories: null,
});

type AuthProviderProps = {
    children: ReactNode;
};
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser>({
        user: null,
        directories: null,
    });

    useEffect(() => {
        let unsubscribeDirectories = () => {}; // Initialize as no-op

        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            // First clean up any existing directory listener
            unsubscribeDirectories();

            if (user) {
                const directoriesRef = collection(
                    db,
                    "user",
                    user.uid,
                    "directory"
                );
                unsubscribeDirectories = onSnapshot(
                    directoriesRef,
                    (snapshot) => {
                        const directories = snapshot.docs.map(
                            (doc) =>
                                ({ ...doc.data(), id: doc.id } as Directory)
                        );

                        setUser({
                            user,
                            directories,
                        });
                    }
                );
            } else {
                setUser({ user: false, directories: null });
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeDirectories(); // Cleanup whatever is current
        };
    }, []); // Empty array is correct here

    const value = user;

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
