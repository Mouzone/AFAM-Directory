"use client";

import { AuthProviderType, AuthUser } from "@/types";
import { auth } from "@/utility/firebase";
import { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<AuthProviderType>({
    user: { uid: "", role: "" },
});
type AuthProviderProps = {
    children: ReactNode;
};
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | false | null>(null); // null is used here to mean loading

    useEffect(() => {
        // i just need the role of the current user
        return auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                const idTokenResult = await firebaseUser.getIdTokenResult();
                const mappedUser = {
                    uid: firebaseUser.uid,
                    role: idTokenResult.claims.role as string,
                    isWelcomeTeamLeader:
                        (idTokenResult.claims.isWelcomeTeamLeader as boolean) ??
                        false,
                };
                setUser(mappedUser);
            } else {
                setUser(false); // false is used here to mean logged out
            }
        });
    }, []);

    const value = {
        user,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
