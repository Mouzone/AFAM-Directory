"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../../utility/firebase";
import { AuthUser } from "../../utility/types";

export const AuthContext = createContext<AuthUser>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [userState, setUserState] = useState<AuthUser>(false);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setUserState(user);
        });

        return () => unsubscribeAuth();
    }, []);

    return (
        <AuthContext.Provider value={userState}>
            {children}
        </AuthContext.Provider>
    );
}
