"use client"

import { createUserWithRole } from "@/utility/cloud-functions"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

export default function Page(){
    const router = useRouter()
    const searchParams = useSearchParams()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    
    const token = searchParams.get("token")

    if (!token) {
        router.push("/")
    }

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await createUserWithRole({ email, password, token})
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
            { errorMessage && <p> {errorMessage} </p> }
        </>
    )
}