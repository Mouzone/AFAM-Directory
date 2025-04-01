"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "./utility/firebase";
import { useMutation } from "@tanstack/react-query";

const login = (credentials: { email: string; password: string }) => {
    return signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
    );
};

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<Error | null>(null);
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log("Login successful:", data);
        },
        onError: (error) => {
            console.error("Login error:", error);
            setError(error);
        },
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    };
    return (
        <form
            className="w-screen h-screen flex justify-center items-center"
            onSubmit={onSubmit}
        >
            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Login</legend>

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
                {error && (
                    <p className="text-center bg-red-200 text-red-400 rounded-2xl p-2 my-2">
                        {error?.message}
                    </p>
                )}
                <button
                    type="submit"
                    className="btn btn-neutral"
                    disabled={email === "" || password === ""}
                >
                    Login
                </button>
            </fieldset>
        </form>
    );
}
