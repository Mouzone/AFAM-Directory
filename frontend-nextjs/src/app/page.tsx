"use client"

import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utility/firebase";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter()
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const onChange = (
        key: "email" | "password",
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCredentials({ ...credentials, [key]: e.target.value });
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form submission refresh
        setLoading(true);
        setError("");

        // write in different file
        try {
            await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );

            // navigate("/students", { replace: true });
            router.push("/directory")
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message); // Set the error message if it's an Error object
            } else {
                setError("An unknown error occurred."); // Handle non-Error objects
            }
            console.error("Error during login:", error); // Log the error for debugging
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
                        value={credentials.email}
                        onChange={(e) => onChange("email", e)}
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
                        value={credentials.password}
                        onChange={(e) => onChange("password", e)}
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
