"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await signIn(email, password);
            router.push("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 sm:p-6">
            <div className="w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
                <div className="backdrop-blur-lg bg-gray-800/80 p-8 rounded-2xl shadow-2xl border border-purple-500/20">
                    <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Sign In
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none text-white placeholder-gray-400"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none text-white placeholder-gray-400"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSignIn}
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium 
                            hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                            focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>

                        <div className="space-y-4">
                            <p className="text-sm text-center text-gray-400">
                                New user?{" "}
                                <a href="/signup" className="text-purple-400 hover:text-purple-300 hover:underline transition-all duration-200">
                                    Sign Up
                                </a>
                            </p>
                            <p className="text-sm text-center">
                                <a href="/forgot-password" className="text-gray-400 hover:text-gray-300 transition-all duration-200">
                                    Forgot your password?
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}