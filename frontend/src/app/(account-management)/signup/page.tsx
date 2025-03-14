"use client";

import { Role } from "@/types";
import { createUserWithRole } from "@/utility/cloud-functions";
import { auth, db } from "@/utility/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            router.push("/");
        } else {
            verifyToken(token);
        }
    }, [token, router]);

    async function verifyToken(token: string) {
        try {
            await signInWithCustomToken(auth, token);
            if (!auth.currentUser) {
                setErrorMessage("Invalid token");
                return;
            }
            const uid = auth.currentUser.uid;
            const docRef = doc(db, "temp", uid);
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
        <div className="h-screen flex items-center">
            <form
                onSubmit={handleSignup}
                className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md"
            >
                <div className="mb-4">
                    <div className="text-lg font-semibold">Role: {role}</div>
                </div>

                <div className="mb-4">
                    <input
                        type="firstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="lastName"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                    Create Account
                </button>

                {loading && (
                    <p className="mt-4 text-center text-gray-600">Loading...</p>
                )}

                {errorMessage && (
                    <p className="mt-4 text-center text-red-500">
                        {errorMessage}
                    </p>
                )}
            </form>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <SignupForm />
        </Suspense>
    );
}
