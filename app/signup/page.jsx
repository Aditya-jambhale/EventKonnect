"use client";

import React, { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setErrorMessage("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/Users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Redirect to login page after signup success
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong!");
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
