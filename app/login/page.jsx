"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format!");
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters, include 1 uppercase letter, 1 digit, and 1 special symbol!"
      );
      return;
    }
    setLoading(true);
    try {
                 
      await signIn(email, password);
      alert("User signed in successfully!");
      setLoading(false)
      router.push("/"); // Redirect after login/signup
        } catch (err) {
          setError(err.message);
        }
    
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-800 text-white">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-900">
          <div className="flex justify-center mb-6 rounded-lg">
            <Image src="/logo.webp" alt="Logo" width={60} height={60} />
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">Sign in</h2>
          <p className="text-center text-white  mb-6">
            Please login to continue your journey.
          </p>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2 h-4 w-4 text-purple-500"
                />
                Keep me logged in
              </label>
              <a href="#" className="text-purple-400 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition-all"
            >
              {loading ? "Logging In..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="text-center text-sm my-4 text-gray-400">or</div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full py-2 px-4 flex items-center justify-center bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              <Image
                src="/google.png"
                alt="Google Logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign in with Google
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Need an account?{" "}
            <a href="signup" className="text-purple-400 hover:underline">
              Create one
            </a>
          </p>
        </div>
      </div>

      {/* Right Section - Background Image */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url("/logo.webp")', height: "100vh" }}
      ></div>
    </div>
  );
}
