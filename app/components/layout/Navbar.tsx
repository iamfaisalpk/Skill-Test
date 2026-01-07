"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuthStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);


    const userInitial = "G";

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
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center font-bold text-black"
                            >
                                {userInitial}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-[#222] rounded shadow-lg py-2 z-50">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 hover:bg-gray-700"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setDropdownOpen(false);
                                        }}
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
