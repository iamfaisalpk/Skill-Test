"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { isAuthenticated, name, logout } = useAuthStore();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <nav className="w-full bg-[#161616] text-white">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold">
                    Skill<span className="text-green-400">Test</span>
                </Link>

                {/* Right */}
                <div className="flex items-center gap-4 relative">
                    {!isAuthenticated ? (
                        <Link
                            href="/login"
                            className="rounded-md border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition"
                        >
                            Login
                        </Link>
                    ) : (
                        <div className="relative">
                            <div
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center cursor-pointer font-bold text-black"
                            >
                                {name?.charAt(0).toUpperCase() || "U"}
                            </div>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] text-white rounded shadow-lg z-50">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 hover:bg-gray-700"
                                    >
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-700"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}