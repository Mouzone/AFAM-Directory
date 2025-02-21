import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./utility/firebase";
import { useNavigate } from "react-router-dom";
import { useTimeout } from "usehooks-ts";

const AuthContext = createContext<User | null | false>(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null | false>(null);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => setUser(user || false));
    }, [auth]);

    return (
        <AuthContext.Provider value={user}>
            {" "}
            {/* Include isLoading in the value */}
            {children}
        </AuthContext.Provider>
    );
};

const UserContext = createContext<User>(undefined as unknown as User);
export const useUser = () => useContext(UserContext)!!;
export const UserProvider = ({ children }: React.PropsWithChildren) => {
    const user = useAuth();
    const navigate = useNavigate();
    useTimeout(() => {
        if (!user) {
            navigate("/", { replace: true });
        }
    }, 5000);

    useEffect(() => {
        if (user === false) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    if (!user) {
        return <div> Loading ... </div>;
    }

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
