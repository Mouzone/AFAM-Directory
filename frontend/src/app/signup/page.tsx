"use client"
import { auth } from "@/utility/firebase"
import { signInWithCustomToken } from "firebase/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page(){
    // check ?token={token}
    // get role
    // if token not valid redirect to login
    // call cloud function create new, then redirect to login
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const token = searchParams.get("token")

    useEffect(() => {
        if (token) {
            verifyToken(token)
        } else {
            setLoading(false)
            router.push("/")
        }
    })

    const verifyToken = async (token: string) => {
        try {
            await signInWithCustomToken(auth, token)
        } catch (e) {
            setErrorMessage("Invalid or expired token")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <p> Loading... </p>
    }

    if (errorMessage) {
        return <p> {errorMessage} </p>
    }
    return (
        <div>
            { token }
        </div>
    )
}