"use client";

import React, { useState } from "react";
import { signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateName = (name) => /^[a-zA-Z ]{3,}$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const validateForm = () => {
    let newErrors = {};

    if (!validateName(name)) newErrors.name = "Full Name must be at least 3 letters.";
    if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!validatePassword(password)) newErrors.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(name, email, password, phone);
      alert("User signed up successfully!");
      router.push("/");
    } catch (error) {
      setErrors({ submit: error.message || "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-800 text-white">
      {/* Left Side: Sign-Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 rounded-lg bg-gray-900 ">
          <h2 className="text-4xl font-bold text-center mb-6 text-white animate-pulse">
            Sign Up
          </h2>
          <p className="text-center mb-4 text-gray-300">
            Join us and start your journey today!
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border-2 border-purple-500 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border-2 border-purple-500 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border-2 border-purple-500 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border-2 border-purple-500 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-sm text-center">
                {errorMessage}
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 text-white bg-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:scale-105"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Already have an account? */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Right Side: Background Image */}
      <div
        className="w-full lg:w-1/2 hidden lg:block bg-cover bg-center"
        style={{
          backgroundImage: 'url("/logo.webp")',
          minHeight: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
