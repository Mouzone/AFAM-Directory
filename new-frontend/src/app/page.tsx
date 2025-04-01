"use client";
import { useState } from "react";

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const submitHandler = () => {};
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <fieldset
                className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box"
                onSubmit={submitHandler}
            >
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

                <button className="btn btn-neutral mt-4">Login</button>
            </fieldset>
        </div>
    );
}
