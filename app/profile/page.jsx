"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { app as firebaseApp } from "@/lib/firebase";
import { AlertCircle, Edit2, Save, X, ArrowLeft, Camera, Loader2, MapPin, Mail, Phone, User,Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DEFAULT_PROFILE_IMAGE = "/user.svg";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);

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
    const fetchEventDetails = async (eventIds) => {
      if (!eventIds || !Array.isArray(eventIds)) return [];
      
      const events = [];
      for (const eventId of eventIds) {
        try {
          const eventRef = ref(db, `events/${eventId}`);
          const snapshot = await get(eventRef);
          if (snapshot.exists()) {
            events.push({ id: eventId, ...snapshot.val() });
          }
        } catch (err) {
          console.error(`Error fetching event ${eventId}:`, err);
        }
      }
      return events;
    };

    const fetchUserData = async (userId) => {
      try {
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setProfile({ ...userData, profilePic: userData.profilePic || DEFAULT_PROFILE_IMAGE });
          setEditableProfile({ ...userData, profilePic: userData.profilePic || DEFAULT_PROFILE_IMAGE });
          if (userData.bookedEvents) {
            const events = await fetchEventDetails(userData.bookedEvents);
            setRegisteredEvents(events);
          }
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
    setSaving(true);

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
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-white bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-lg transition duration-200 backdrop-blur-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </Link>
        </div>

        {/* Alerts */}
        <div className="space-y-4 mb-6">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border border-red-500/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-500/10 border border-green-500/50 text-green-400">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Profile Card */}
        <div className="backdrop-blur-lg bg-gray-800/40 rounded-2xl shadow-2xl border border-purple-500/20 p-8">
          <div className="flex flex-col items-center">
            {/* Profile Image */}
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/50 group-hover:border-purple-400/50 transition-all duration-300">
                <Image
                  src={imageError ? DEFAULT_PROFILE_IMAGE : profile.profilePic}
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Edit Controls */}
            <div className="mt-6 w-full">
              <div className="flex justify-center mb-8">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-purple-600/80 px-6 py-2 rounded-lg hover:bg-purple-500/80 transition-all duration-200 backdrop-blur-sm"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditableProfile(profile);
                        setIsEditing(false);
                      }}
                      className="flex items-center gap-2 bg-gray-700/50 px-6 py-2 rounded-lg hover:bg-gray-600/50 transition-all duration-200 backdrop-blur-sm"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 bg-purple-600/80 px-6 py-2 rounded-lg hover:bg-purple-500/80 transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="space-y-6 max-w-xl mx-auto">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={editableProfile.name}
                        onChange={(e) => setEditableProfile({ ...editableProfile, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Name"
                      />
                    </div>
                    <textarea
                      value={editableProfile.bio}
                      onChange={(e) => setEditableProfile({ ...editableProfile, bio: e.target.value })}
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Bio"
                      rows={3}
                    />
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={editableProfile.phone}
                        onChange={(e) => setEditableProfile({ ...editableProfile, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={editableProfile.location}
                        onChange={(e) => setEditableProfile({ ...editableProfile, location: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Location"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {profile.name}
                    </h2>
                    <p className="text-gray-300 text-lg">{profile.bio}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-purple-400" />
                        {profile.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-purple-400" />
                        {profile.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        {profile.location}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 backdrop-blur-lg bg-gray-800/40 rounded-2xl shadow-2xl border border-purple-500/20 p-8">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Registered Events
                </h3>

                {registeredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registeredEvents.map((event) => (
                      <Link href={`/events/${event.id}`} key={event.id}>
                        <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-600/50 transition-all duration-200 border border-purple-500/20">
                          <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 text-sm mt-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.venueType === 'online' ? 'Online Event' : event.venue}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No registered events found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}