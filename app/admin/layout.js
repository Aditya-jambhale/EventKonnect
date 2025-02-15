"use client";

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "@/components/sidebaradmin";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-full relative">
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded-full shadow-md">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-50 bg-gray-900 md:w-72 md:flex md:flex-col transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <ToastContainer />
      <main className="md:pl-72 p-4">{children}</main>
    </div>
  );
}
