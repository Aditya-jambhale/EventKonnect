"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { FaUser, FaBell, FaMapMarkerAlt, FaSearch, FaCalendarPlus, FaChevronDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

export function Header() {
    const [user, setUser] = useState(null); // Replace with actual auth logic
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showAuthDropdown, setShowAuthDropdown] = useState(false);

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
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <input 
                        type="text" 
                        placeholder="Search events..." 
                        className="w-full py-2 pl-4 pr-10 rounded-full bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <FaSearch className="absolute right-3 top-2.5 text-gray-400 text-lg" />
                </div>

                {/* Right Section - Buttons & Icons */}
                <div className="flex items-center space-x-6">
                    
                    {/* Locations Dropdown */}
                    <div className="relative hidden md:block">
                        <button 
                            className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-purple-600 transition"
                            onClick={() => setShowCityDropdown(!showCityDropdown)}
                        >
                            <FaMapMarkerAlt className="text-lg" />
                            <span>Locations</span>
                            <FaChevronDown className={`text-sm transition-transform ${showCityDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showCityDropdown && (
                            <div className="absolute left-0 mt-2 w-40 bg-gray-900 text-white rounded-lg shadow-lg">
                                <button className="block w-full text-left px-4 py-2 hover:bg-purple-500">Mumbai</button>
                                <button className="block w-full text-left px-4 py-2 hover:bg-purple-500">Delhi</button>
                                <button className="block w-full text-left px-4 py-2 hover:bg-purple-500">Gujarat</button>
                            </div>
                        )}
                    </div>

                    {/* Create Event Button */}
                    <Link href="/admin" className="hidden md:block">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-6 py-2 rounded-lg text-white shadow-lg transition-transform transform hover:scale-105">
                            Create Event
                        </Button>
                    </Link>

                    {/* Notifications Icon */}
                    {user && (
                        <Link href="/notifications" className="relative">
                            <FaBell className="text-xl text-white hover:text-purple-400 transition" />
                            <span className="absolute top-0 right-0 text-xs text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                                3
                            </span>
                        </Link>
                    )}

                    {/* Profile/Login Dropdown */}
                    <div className="relative">
                        <button 
                            className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-purple-600 transition"
                            onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                        >
                            {user ? (
                                <>
                                    <img src={user.avatar || "/default-avatar.png"} alt="Profile" className="w-8 h-8 rounded-full" />
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
                                    <>
                                        <Link href="/profile" className="block px-4 py-2 hover:bg-purple-500">Profile</Link>
                                        <button className="block w-full text-left px-4 py-2 hover:bg-purple-500" onClick={() => setUser(null)}>Logout</button>
                                    </>
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
            </div>
        </header>
    );
}
