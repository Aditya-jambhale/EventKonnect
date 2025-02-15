"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FaUser, FaBell, FaSearch, FaChevronDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export function Header() {
    const [user, setUser] = useState(null);
    const [dropdowns, setDropdowns] = useState({ auth: false });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <header className="sticky top-0 z-50 border-b bg-gray-900 backdrop-blur-md">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
                {/* Mobile Menu */}
                <div className="flex items-center space-x-4 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
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
                                {user ? (
                                    <>
                                        <Link href="/profile" className="text-lg hover:text-purple-400">Profile</Link>
                                        <button className="text-lg hover:text-purple-400 text-left" onClick={handleLogout}>Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/signIn" className="text-lg hover:text-purple-400">Login</Link>
                                        <Link href="/signup" className="text-lg hover:text-purple-400">Signup</Link>
                                    </>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image src="/logo.webp" alt="Logo" width={40} height={40} className="rounded-full" />
                    <span className="font-bold text-white text-2xl">EventKonnect</span>
                </Link>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full py-2 pl-4 pr-10 rounded-full bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <FaSearch className="absolute right-3 top-2.5 text-gray-400 text-lg" />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/admin">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-6 py-2 rounded-lg text-white shadow-lg transition-transform transform hover:scale-105">
                            Create Event
                        </Button>
                    </Link>

                    <Link href="/notifications" className="relative">
                        <FaBell className="text-2xl text-white hover:text-purple-400 cursor-pointer" />
                        <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center animate-pulse">3</span>
                    </Link>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-purple-600 transition"
                            onClick={() => setDropdowns({ auth: !dropdowns.auth })}
                        >
                            <FaUser className="text-lg" />
                            <span>{user ? user.displayName || "User" : "Login"}</span>
                            <FaChevronDown className={`text-sm transition-transform ${dropdowns.auth ? "rotate-180" : ""}`} />
                        </button>
                        {dropdowns.auth && (
                            <div className="absolute right-0 mt-2 w-40 bg-gray-900 text-white rounded-lg shadow-lg">
                                {user ? (
                                    <>
                                        <Link href="/profile" className="block px-4 py-2 hover:bg-purple-500">Profile</Link>
                                        <button className="block w-full text-left px-4 py-2 hover:bg-purple-500" onClick={handleLogout}>Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/signIn" className="block px-4 py-2 hover:bg-purple-500">Login</Link>
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