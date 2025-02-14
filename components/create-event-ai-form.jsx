"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export const CreateEventAIForm = ({ onGenerate }) => {
    const [eventTitle, setEventTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        onGenerate(eventTitle); // Only pass event title, no API call here
        setLoading(false);
    };

    return (
        <div className="flex flex-col w-full items-center bg-gray-900 text-white px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-gray-800 p-6 rounded-lg shadow-lg"
            >
                <h1 className="text-2xl font-bold text-center">Create with AI</h1>
                <p className="text-gray-400 mt-2 text-center">
                    Enter event title and generate details with AI.
                </p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="text"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your event title"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full p-3 text-white font-medium rounded-md bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate Event with AI"}
                    </button>
                </form>

                {loading && <p className="text-center text-blue-400 mt-4">Generating event details...</p>}
            </motion.div>
        </div>
    );
};
