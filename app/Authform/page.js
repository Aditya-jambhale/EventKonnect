"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

export default function AuthForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // Initialize router

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
            router.push("/"); // Redirect after login/signup
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>
            {error && <p className="text-red-500">{error}</p>}
            
            {isSignUp && (
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-2 border rounded text-black"
                />
            )}
            
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-2 border rounded text-black"
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-2 border rounded text-black"
            />
            {isSignUp && (
                <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 mb-4 border rounded text-black"
                />
            )}
            <button 
                onClick={handleAuth} 
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                {isSignUp ? "Sign Up" : "Sign In"}
            </button>
            <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-2 text-sm text-gray-600 hover:underline"
            >
                {isSignUp ? "Already have an account? Sign in" : "New user? Sign up"}
            </button>
        </div>
    );
}