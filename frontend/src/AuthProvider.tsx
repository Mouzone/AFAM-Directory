import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, onIdTokenChanged, User} from "firebase/auth"
import { app } from "./utility/firebase"
import { AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    token: null,
    setToken: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const auth = getAuth(app);

    useEffect(() => {
        const combinedUnsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user); // Update user state

            if (user) {
                const idToken = await user.getIdToken();
                setToken(idToken); // Update token state
            } else {
                setToken(null);
            }
        });

        onIdTokenChanged(auth, async (user) => {
            if (user) {
              const idToken = await user.getIdToken();
              setToken(idToken);
            } else {
              setToken(null);
            }
        });

        return () => combinedUnsubscribe(); // Combined unsubscribe
    }, [auth]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)