"use client"

import { createUserWithRole } from "@/utility/cloud-functions"
import { auth } from "@/utility/firebase"
import { signInWithCustomToken, updateEmail, updatePassword } from "firebase/auth"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

export default function Page(){
    const router = useRouter()
    const searchParams = useSearchParams()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    
    const token = searchParams.get("token")



    useEffect(() => {
        if (!token) {
            router.push("/")
        } else {
            verifyToken(token)
        }
    })
    
    async function verifyToken(token: string) {
        try {
            await signInWithCustomToken(auth, token)
        } catch(e) {
            setErrorMessage(`Invalid or expired token. ${e}`)
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            if (!auth.currentUser) {
                setErrorMessage("Invalid token")
                return
            }

            const uid = auth.currentUser.uid
            const response = await createUserWithRole({uid, email, password})
            // if error show error message, else show success and redirect to login
            console.log(response)
        } catch (error) {
            console.error('Error creating user:', error);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
        }
    }

    return (
        <>
            <form onSubmit={handleSignup}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Create Account</button>
            </form>
            { loading && <p> Loading... </p>}
            { errorMessage && <p> {errorMessage} </p> }
        </>
    )
}