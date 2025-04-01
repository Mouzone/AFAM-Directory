"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "./utility/firebase";

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
        } catch (e) {
            if (e instanceof Error) {
                console.log(e);
                setError(e.message);
            }
        }
    }
    return (
        <form
            className="w-screen h-screen flex justify-center items-center"
            onSubmit={(e) => submitHandler(e)}
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
                <p className="text-center bg-red-200 text-red-400 rounded-2xl p-2 my-2">
                    {error}
                </p>
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
