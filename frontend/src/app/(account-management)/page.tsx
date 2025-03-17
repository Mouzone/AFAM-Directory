"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utility/firebase";

export default function Page() {
    const router = useRouter();
    const context = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { user } = context;

    useEffect(() => {
        // checks if user is false (logged out)
        if (user === false) {
            router.push("/");
        }
    }, [user, router]);

    if (context.user === null) {
        return <div> Loading... </div>;
    }

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form submission refresh
        setError("");
        setLoading(true);

        // write in different file
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/directory");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || "Login failed");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Login
                </h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email:
                    </label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password:
                    </label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Logging in..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
