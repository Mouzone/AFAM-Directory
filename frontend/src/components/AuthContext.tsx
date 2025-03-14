"use client";

import { auth } from "@/utility/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // i just need the role of the current user
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                const idTokenResult = await firebaseUser.getIdTokenResult();
                const mappedUser = {
                    uid: firebaseUser.uid,
                    role: idTokenResult.claims.role,
                    isWelcomeTeamLeader:
                        idTokenResult.claims.isWelcomeTeamLeader ?? false,
                };
                setUser(mappedUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
            // Firebase auth state change will automatically trigger the useEffect
        } catch (error) {
            console.error("Logout error:", error);
            // Handle logout error
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
