"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "./utility/firebase";

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const submitHandler = async () => {
        const response = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        console.log(response);
    };
    return (
        <form
            className="w-screen h-screen flex justify-center items-center"
            onSubmit={submitHandler}
        >
            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Login</legend>

                <label className="fieldset-label">Email</label>
                <input type="email" className="input" placeholder="Email" />

                <label className="fieldset-label">Password</label>
                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                />
                <button type="submit" className="btn btn-neutral mt-4">
                    Login
                </button>
            </fieldset>
        </form>
    );
}
