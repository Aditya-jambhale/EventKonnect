"use client";

import { useState, useEffect } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { FaUser, FaBell, FaMapMarkerAlt, FaSearch, FaCalendarPlus, FaChevronDown, FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

export function Header() {
    const [userLocation, setUserLocation] = useState("Fetching location...");
    const [searchLocation, setSearchLocation] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [user, setUser] = useState(null);
    const [showAuthDropdown, setShowAuthDropdown] = useState(false);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
                        const { latitude, longitude } = position.coords;

                        const response = await fetch(
                            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
                        );
                        const data = await response.json();

                        if (data.results?.[0]?.components?.city) {
                            setUserLocation(data.results[0].components.city);
                        } else {
                            setUserLocation("Location not found");
                        }
                    } catch (error) {
                        console.error("Error fetching location:", error);
                        setUserLocation("Unable to fetch location");
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setUserLocation("Location access denied");
                }
            );
        } else {
            setUserLocation("Geolocation not supported");
        }
    }, []);

    const handleLocationSearch = async (searchInput) => {
        try {
            setIsSearching(true);
            const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchInput)}&key=${apiKey}`
            );
            const data = await response.json();

            if (data.results?.[0]?.components?.city) {
                setSearchLocation(data.results[0].components.city);
            }
        } catch (error) {
            console.error("Error searching location:", error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900 shadow-lg backdrop-blur-md">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
                {/* Left Section - Mobile Menu & Logo */}
                <div className="flex items-center space-x-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6 text-white" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-4 bg-gray-900 text-white">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-purple-500">Menu</span>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <X className="h-5 w-5 text-white" />
                                    </Button>
                                </SheetTrigger>
                            </div>
                            <nav className="mt-6 flex flex-col space-y-4">
                                <Link href="/" className="text-lg font-semibold hover:text-purple-400">Home</Link>
                                <Link href="/admin" className="text-lg hover:text-purple-400">Create Event</Link>
                                <Link href="/notifications" className="text-lg hover:text-purple-400">Notifications</Link>
                                <Link href="/profile" className="text-lg hover:text-purple-400">Profile</Link>
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center space-x-2">
                        <FaCalendarPlus className="text-purple-400 text-3xl" />
                        <span className="font-bold text-white text-2xl">EventKonnect</span>
                    </Link>
                </div>

                {/* Middle Section - Search Bar */}
                <div className="relative flex items-center w-64 md:w-80">
                    <input
                        type="text"
                        placeholder="Search location..."
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleLocationSearch(e.target.value);
                            }
                        }}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black w-full"
                    />
                    <FaSearch className="absolute left-3 text-gray-600 h-5 w-5" />
                </div>

                {/* Create Event Button */}
                <Link href="/admin">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <FaPlus className="text-white" />
                        <span>Create Event</span>
                    </Button>
                </Link>

                {/* Profile/Login Dropdown */}
                <div className="relative">
                    <button 
                        className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-purple-600 transition"
                        onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                    >
                        {user ? (
                            <>
                                <FaUser className="text-lg" />
                                <span>{user.name}</span>
                            </>
                        ) : (
                            <>
                                <FaUser className="text-lg" />
                                <span>Login</span>
                            </>
                        )}
                        <FaChevronDown className={`text-sm transition-transform ${showAuthDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showAuthDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-gray-900 text-white rounded-lg shadow-lg">
                            {user ? (
                                <button className="block w-full text-left px-4 py-2 hover:bg-purple-500" onClick={() => setUser(null)}>Logout</button>
                            ) : (
                                <>
                                    <Link href="/login" className="block px-4 py-2 hover:bg-purple-500">Login</Link>
                                    <Link href="/signup" className="block px-4 py-2 hover:bg-purple-500">Signup</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
