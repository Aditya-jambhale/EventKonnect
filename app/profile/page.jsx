"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("registered");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profilePic: "/logo.webp", // Default profile pic
  });
  const [events, setEvents] = useState({ registered: [], created: [] });

  useEffect(() => {
    // Simulate fetching user data (Replace with backend API)
    setTimeout(() => {
      setProfile({
        name: "Rohan Govindwaranta",
        email: "rohan@example.com",
        phone: "+91 98765 43210",
        profilePic: "/logo.webp",
      });

      // Simulate fetching events (Replace with backend API)
      setEvents({
        registered: [
          { id: 1, name: "Tech Conference 2024", date: "12 Dec 2024" },
          { id: 2, name: "AI Workshop", date: "15 Jan 2025" },
        ],
        created: [{ id: 3, name: "Web Dev Bootcamp", date: "05 Feb 2025" }],
      });
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4 sm:px-8">
      {/* Profile Section */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-3xl flex flex-col items-center">
        {/* Profile Picture */}
        <div className="relative">
          <Image
            src={profile.profilePic}
            alt="Profile Picture"
            width={120}
            height={120}
            className="rounded-full border-4 border-purple-600 shadow-md"
          />
          <button
            id="edit-profile-pic"
            className="absolute bottom-0 right-0 bg-purple-600 text-black text-xs px-3 py-1 rounded-full hover:bg-purple-700 transition"
          >
            Edit
          </button>
        </div>

        {/* User Details */}
        <h2 id="user-name" className="text-2xl font-bold mt-4 hover:text-purple-400 transition">
          {profile.name}
        </h2>
        <p id="user-email" className="text-lg text-gray-300 hover:text-white transition">
          📧 {profile.email}
        </p>
        <p id="user-phone" className="text-lg text-gray-300 hover:text-white transition">
          📞 {profile.phone}
        </p>

        {/* Edit Profile Button */}
        <button
          id="edit-profile-btn"
          className="mt-4 bg-purple-600 text-black font-bold px-6 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Tabs Section */}
      <div className="mt-8 w-full max-w-3xl">
        <div className="flex justify-center space-x-4">
          <button
            id="registered-tab"
            onClick={() => setActiveTab("registered")}
            className={`px-6 py-2 rounded-md font-bold ${
              activeTab === "registered" ? "bg-purple-600 text-black" : "bg-gray-800 text-white"
            } hover:scale-105 transition`}
          >
            Registered Events
          </button>
          <button
            id="created-tab"
            onClick={() => setActiveTab("created")}
            className={`px-6 py-2 rounded-md font-bold ${
              activeTab === "created" ? "bg-purple-600 text-black" : "bg-gray-800 text-white"
            } hover:scale-105 transition`}
          >
            Created Events
          </button>
        </div>

        {/* Event List */}
        <div className="mt-6 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            {activeTab === "registered" ? "Registered Events" : "Created Events"}
          </h3>
          <ul>
            {(activeTab === "registered" ? events.registered : events.created).map((event) => (
              <li
                key={event.id}
                className="bg-gray-800 p-4 rounded-lg mb-2 hover:bg-gray-700 transition"
              >
                <span className="font-bold text-purple-400">{event.name}</span> -{" "}
                <span className="text-gray-300">{event.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
