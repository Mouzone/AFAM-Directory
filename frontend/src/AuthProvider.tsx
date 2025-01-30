import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, onIdTokenChanged } from "firebase/auth"
import { app } from "./utility/firebase"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
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