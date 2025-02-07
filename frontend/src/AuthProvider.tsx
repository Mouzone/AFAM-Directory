import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, onIdTokenChanged, User } from "firebase/auth";
import { app } from "./utility/firebase";
import { AuthContextType } from "./types"; // Make sure your types include isLoading

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    token: null,
    setToken: () => {},
    isLoading: true, // Initial loading state
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true); // Add isLoading state
    const auth = getAuth(app);

    useEffect(() => {
        const combinedUnsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                const idToken = await user.getIdToken();
                setToken(idToken);
                localStorage.setItem('token', idToken);
            } else {
                setToken(null);
                localStorage.removeItem('token');
            }

            setIsLoading(false); // Authentication status is known, set isLoading to false
        });

        onIdTokenChanged(auth, async (user) => {
          if (user) {
            const idToken = await user.getIdToken();
            setToken(idToken);
            localStorage.setItem('token', idToken);
          } else {
            setToken(null);
            localStorage.removeItem('token');
          }
      });

        return () => combinedUnsubscribe();
    }, [auth]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, isLoading }}> {/* Include isLoading in the value */}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);