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

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User| null>(null)
    const [token, setToken] = useState<string | null>(null)
    const auth = getAuth(app)

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user)
                const idToken = await user.getIdToken()
                setToken(idToken)
            } else {
                setUser(null)
                setToken(null)
            }
        })
        
        const unsubscribeToken = onIdTokenChanged(auth, async (user) => {
            if (user) {
                const idToken = await user.getIdToken()
                setToken(idToken)
            }
        })
        return () => {
            unsubscribeAuth()
            unsubscribeToken()
        }
    }, [auth])

    return (
        <AuthContext.Provider value = {{user, setUser, token, setToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)