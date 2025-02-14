"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Import Link for navigation
import Image from "next/image";
import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { app as firebaseApp } from "@/lib/firebase";
import { AlertCircle, Edit2, Save, X, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DEFAULT_PROFILE_IMAGE = "/user.svg";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    profilePic: DEFAULT_PROFILE_IMAGE,
    social: { twitter: "", linkedin: "", github: "" },
  });

  const [editableProfile, setEditableProfile] = useState(profile);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const db = getDatabase(firebaseApp);

    const fetchUserData = async (userId) => {
      try {
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setProfile({ ...userData, profilePic: userData.profilePic || DEFAULT_PROFILE_IMAGE });
          setEditableProfile({ ...userData, profilePic: userData.profilePic || DEFAULT_PROFILE_IMAGE });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfile((prev) => ({ ...prev, email: user.email }));
        fetchUserData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");

    try {
      const auth = getAuth(firebaseApp);
      const db = getDatabase(firebaseApp);
      const user = auth.currentUser;

      if (user) {
        const updatedProfile = {
          ...editableProfile,
          profilePic: editableProfile.profilePic || DEFAULT_PROFILE_IMAGE,
        };

        await update(ref(db, `users/${user.uid}`), updatedProfile);

        if (updatedProfile.name !== profile.name) {
          await updateProfile(user, { displayName: updatedProfile.name });
        }

        setProfile(updatedProfile);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Error updating profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white py-10 px-4">
      
      {/* Back to Home Button */}
      <div className="w-full max-w-3xl">
        <Link href="/">
          <button className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </Link>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4 bg-green-500">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Profile Card */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-3xl text-center">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <Image
              src={imageError ? DEFAULT_PROFILE_IMAGE : profile.profilePic}
              alt="Profile Picture"
              width={120}
              height={120}
              className="rounded-full border-4 border-purple-600 shadow-md transition-all duration-300 group-hover:border-purple-400"
              onError={() => setImageError(true)}
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 shadow-lg hover:bg-purple-500 transition-colors">
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-6 w-full">
            <div className="flex justify-center mb-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditableProfile(profile);
                      setIsEditing(false);
                    }}
                    className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              {isEditing ? (
                <>
                  {["name", "bio", "phone", "location"].map((field) => (
                    <input
                      key={field}
                      type="text"
                      value={editableProfile[field]}
                      onChange={(e) =>
                        setEditableProfile({ ...editableProfile, [field]: e.target.value })
                      }
                      className="w-full bg-gray-800 p-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    />
                  ))}
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold hover:text-purple-400 transition">{profile.name}</h2>
                  <p className="text-gray-300">{profile.bio}</p>
                  <p className="text-gray-300">📧 {profile.email}</p>
                  <p className="text-gray-300">📞  {profile.phone}</p>
                  <p className="text-gray-300">📍 {profile.location}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
