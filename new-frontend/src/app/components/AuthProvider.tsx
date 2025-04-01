"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../utility/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
    Directory,
    LoadedUser,
    LoadingUser,
    LoggedOutUser,
} from "../utility/types";

export const AuthContext = createContext<
    LoadingUser | LoadedUser | LoggedOutUser
>({
    user: null,
    directories: null,
});

type AuthProviderProps = {
    children: ReactNode;
};
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<LoadingUser | LoadedUser | LoggedOutUser>({
        user: null,
        directories: null,
    });

    useEffect(() => {
        return auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                const docRefs = await getDocs(
                    collection(db, "users", firebaseUser.uid, "directories")
                );
                const directories = docRefs.docs.map((docRef) => {
                    return { id: docRef.id, ...docRef.data() } as Directory;
                });
                setUser({
                    user: firebaseUser,
                    directories,
                });
            } else {
                setUser({ user: false, directories: null }); // false is used here to mean logged out
            }
        });
    }, []);

    const value = user;

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
