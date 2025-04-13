"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signUp } from "@/utility/signUp";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/utility/firebase";

// todo: add redirect if user is already logged in
export default function SignUpForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<Error | null>(null);
    const [inputError, setInputError] = useState("");
    const router = useRouter();
    const mutation = useMutation({
        mutationFn: signUp,
        onSuccess: async (data) => {
            // todo: provide indicator login was succesful or loading...
            const user = data.user;
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`,
            });
            const docRef = doc(db, "user", user.uid);
            await setDoc(docRef, {
                "First Name": firstName,
                "Last Name": lastName,
                Email: email,
            });
            router.push("/directory");
        },
        onError: (error) => {
            setError(error);
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (password !== confirmPassword) {
                    setInputError("Password does not match");
                }
                mutation.mutate({
                    email,
                    password,
                });
            }}
        >
            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Signup</legend>

                <label className="fieldset-label">First Name</label>
                <input
                    type="text"
                    className="input"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <label className="fieldset-label">Last Name</label>
                <input
                    type="text"
                    className="input"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />

                <label className="fieldset-label">Email</label>
                <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="fieldset-label">Password</label>
                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label className="fieldset-label">Confirm Password</label>
                <input
                    type="password"
                    className="input"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && (
                    <p className="text-center bg-red-200 text-red-400 rounded-2xl p-2 my-2">
                        {error?.message}
                    </p>
                )}
                {inputError !== "" && (
                    <p className="text-center bg-red-200 text-red-400 rounded-2xl p-2 my-2">
                        {inputError}
                    </p>
                )}
                <button
                    type="submit"
                    className="btn btn-neutral"
                    disabled={
                        firstName === "" ||
                        lastName === "" ||
                        email === "" ||
                        password === ""
                    }
                >
                    Sign Up
                </button>
            </fieldset>
        </form>
    );
}
