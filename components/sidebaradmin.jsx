"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BarChart2,
    Wallet,
    TrendingUp,
    UserCircle,
    Calendar,
    Users,
    Settings
} from "lucide-react";

import { cn } from "@/lib/utils";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
        emoji: "🎯",
    },
    {
        label: "Reports",
        icon: BarChart2,
        href: "/dashboard/reports",
        emoji: "📊",
    },
    {
        label: "Finance",
        icon: Wallet,
        href: "/dashboard/finance",
        emoji: "💰",
    },
    {
        label: "Event Analytics",
        icon: TrendingUp,
        href: "/admin/Analytics",
        emoji: "📈",
    },
    {
        label: "Events",
        icon: Calendar,
        href: "/dashboard/events",
        emoji: "🎪",
    },

    {
        label: "Profile",
        icon: UserCircle,
        href: "/profile",
        emoji: "👤",
    },

];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold">EventKonnect</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => {
                        const Icon = route.icon; // Assign icon to a variable
                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <Icon className="h-5 w-5 mr-3" />
                                    {route.label}
                                    <span className="ml-2">{route.emoji}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
