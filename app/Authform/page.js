"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AuthForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleAuth = async () => {
        setError(null);
        try {
            if (isSignUp) {
                await signUp(name, email, password, phone);
                alert("User signed up successfully!");
            } else {
                await signIn(email, password);
                alert("User signed in successfully!");
            }
            router.push("/"); // Redirect to home page after login/signup
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-6">
            <div className="w-full max-w-md p-8 rounded-xl bg-gray-800 shadow-lg shadow-purple-600/50 transform transition-all duration-300 hover:scale-105">
                <h2 className="text-4xl font-bold text-center mb-4 text-purple-400 animate-pulse">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {isSignUp && (
                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-purple-500 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-purple-500 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-purple-500 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {isSignUp && (
                    <div>
                        <label className="block text-sm font-medium">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-purple-500 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>
                )}

                <button
                    onClick={handleAuth}
                    className="w-full py-2 px-4 bg-purple-600 border border-purple-600 rounded-lg font-semibold text-white hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:scale-105 mt-4"
                >
                    {isSignUp ? "Sign Up" : "Sign In"}
                </button>

                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="mt-4 text-sm text-center text-purple-400 hover:underline block"
                >
                    {isSignUp ? "Already have an account? Sign in" : "New user? Sign up"}
                </button>
            </div>
        </div>
    );
}