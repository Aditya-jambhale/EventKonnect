"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app as firebaseApp, auth, database } from '@/lib/firebase';


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("registered");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profilePic: "/logo.webp",
  });
  const [events, setEvents] = useState({ registered: [], created: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const db = getDatabase(firebaseApp);
    
    const fetchUserData = async (userId) => {
      try {
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setProfile(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfile((prev) => ({ ...prev, email: user.email }));
        fetchUserData(user.uid);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4 sm:px-8">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-3xl flex flex-col items-center">
        <div className="relative">
          <Image
            src={profile.profilePic}
            alt="Profile Picture"
            width={120}
            height={120}
            className="rounded-full border-4 border-purple-600 shadow-md"
          />
        </div>
        <h2 className="text-2xl font-bold mt-4 hover:text-purple-400 transition">{profile.name}</h2>
        <p className="text-lg text-gray-300 hover:text-white transition">📧 {profile.email}</p>
        <p className="text-lg text-gray-300 hover:text-white transition">📞 {profile.phone}</p>
      </div>
    </div>
  );
}
