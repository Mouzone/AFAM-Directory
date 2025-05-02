"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../utility/login";
import { useRouter } from "next/navigation";

// todo: add redirect if user is already logged in
export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { error, isPending, isSuccess, mutate } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            // todo: provide indicator login was succesful or loading...
            router.push("/directory/afam");
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                mutate({ email, password });
            }}
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
                    className="btn btn-neutral dark:btn-secondary"
                    disabled={email === "" || password === ""}
                >
                    {!isPending && !isSuccess && <span> Login </span>}
                    {isPending && (
                        <span className="loading loading-spinner loading-md"></span>
                    )}
                    {isSuccess && <span> Redirecting... </span>}
                </button>
            </fieldset>
        </form>
    );
}
