"use client";

import { Role } from "@/types";
import { createUserWithRole } from "@/utility/cloud-functions";
import { auth, db } from "@/utility/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    useEffect(() => {
        const searchParams = useSearchParams();
        const token = searchParams.get("token");

        if (!token) {
            router.push("/");
        } else {
            verifyToken(token);
        }
    });

    async function verifyToken(token: string) {
        try {
            await signInWithCustomToken(auth, token);
            if (!auth.currentUser) {
                setErrorMessage("Invalid token");
                return;
            }
            const uid = auth.currentUser.uid;
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setRole(docSnap.data().role);
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (e) {
            setErrorMessage(`Invalid or expired token. ${e}`);
        } finally {
            setLoading(false);
        }
    }

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!auth.currentUser) {
                setErrorMessage("Invalid token");
                return;
            }

            const uid = auth.currentUser.uid;
            const response = await createUserWithRole({
                uid,
                firstName,
                lastName,
                email,
                password,
            });
            // if error show error message, else show success and redirect to login
            console.log(response);
        } catch (error) {
            console.error("Error creating user:", error);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSignup}>
                <div> Role: {role} </div>
                <input
                    type="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Create Account</button>
            </form>
            {loading && <p> Loading... </p>}
            {errorMessage && <p> {errorMessage} </p>}
        </>
    );
}
