"use client";

import { useState, useEffect } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons";

export function Header() {
    const [userLocation, setUserLocation] = useState("Fetching location...");
    const [searchLocation, setSearchLocation] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Fetch user's current location and perform reverse geocoding
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY; // Fetch API key from .env.local
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

    // Handle manual location search
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
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
                {/* Left Section - Mobile Menu */}
                <div className="flex items-center space-x-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-purple-500">Menu</span>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                            </div>
                            <nav className="mt-6 flex flex-col space-y-4">
                                <Link href="/" className="text-lg font-semibold hover:text-purple-600">
                                    Home
                                </Link>
                                <Link href="/admin" className="text-lg hover:text-purple-600">
                                    Create Event
                                </Link>
                                <Link href="/app/notfications" className="text-lg hover:text-purple-600">
                                    Notifications
                                </Link>
                                <Link href="/app/profile" className="text-lg hover:text-purple-600">
                                    Profile
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-purple-50 text-2xl">EventKonnect</span>
                    </Link>
                </div>

                {/* Right Section - Desktop View */}
                <div className="hidden md:flex items-center space-x-4">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
                        />
                    </div>

                    {/* Location Input */}
                    <div className="relative flex items-center">
                        <MapPin className="absolute left-3 text-black h-5 w-5" />
                        <input
                            type="text"
                            placeholder={userLocation}
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleLocationSearch(e.target.value);
                                }
                            }}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black w-48"
                        />
                    </div>

                    {/* Create Event Button */}
                    <Link href="/admin">
                        <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-sm md:text-base text-white">
                            Create Event
                        </Button>
                    </Link>

                    {/* Notifications Icon */}
                    <Link href="/notifications" className="relative">
                        <FontAwesomeIcon icon={faBell} className="text-lg hover:text-purple-600" />
                        <span className="absolute top-0 right-0 text-xs text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                            3
                        </span>
                    </Link>

                    {/* Profile Icon */}
                    <Link href="/profile" className="relative">
                        <FontAwesomeIcon icon={faUser} className="text-lg hover:text-purple-600" />
                    </Link>
                </div>

                {/* Mobile View - Location and Profile */}
                <div className="flex md:hidden items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => handleLocationSearch(userLocation)}>
                        <MapPin className="h-5 w-5" />
                    </Button>
                    <Link href="/profile">
                        <FontAwesomeIcon icon={faUser} className="text-lg" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
