"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../../utility/firebase";
import {
    collection,
    onSnapshot,
    DocumentData,
    QueryDocumentSnapshot,
} from "firebase/firestore";
import { AuthUser, Directory } from "../../utility/types";

export const AuthContext = createContext<AuthUser>({
    user: null,
    directories: [],
});

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [userState, setUserState] = useState<AuthUser>({
        user: null,
        directories: [],
    });

    useEffect(() => {
        let unsubscribeDirectories = () => {};

        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            // Cleanup previous directory listener
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
                        const updatedDirectories: DocumentData[] = [];

                        snapshot.forEach((doc: QueryDocumentSnapshot) => {
                            updatedDirectories.push({
                                id: doc.id,
                                ...doc.data(),
                            });
                        });

                        setUserState({
                            user,
                            directories: updatedDirectories as Directory[],
                        });
                    }
                );
            } else {
                setUserState({ user: false, directories: [] });
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeDirectories();
        };
    }, []);

    return (
        <AuthContext.Provider value={userState}>
            {children}
        </AuthContext.Provider>
    );
}
