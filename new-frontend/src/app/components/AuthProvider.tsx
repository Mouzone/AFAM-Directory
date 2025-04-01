"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../utility/firebase";
import { User } from "firebase/auth";

export const AuthContext = createContext<User | false | null>(null);
type AuthProviderProps = {
    children: ReactNode;
};
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | false | null>(null); // null is used here to mean loading

    useEffect(() => {
        // i just need the role of the current user
        return auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(false); // false is used here to mean logged out
            }
        });
    }, []);

    const value = user;

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
