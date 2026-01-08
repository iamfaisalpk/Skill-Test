"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
    const { isAuthenticated, name, logout } = useAuthStore();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/login");
        setDropdownOpen(false);
    };

    return (
        <nav className="w-full bg-black text-white border-b border-gray-900">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/images/shoeImage.png"
                        alt="Logo"
                        width={60}
                        height={30}
                        className="object-contain"
                        priority
                    />
                </Link>

                <div className="relative">
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center cursor-pointer gap-3 hover:opacity-80 transition"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                    <User size={18} />
                                </div>
                                <span className="hidden sm:block text-sm">
                                    {name || "User"}
                                </span>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-black border border-gray-800 rounded-md shadow-xl z-50">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-900 transition"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <User size={18} />
                                        <span>My Orders</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center cursor-pointer gap-3 px-4 py-3 hover:bg-gray-900 transition w-full text-left"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm hover:opacity-80 transition"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {dropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                />
            )}
        </nav>
    );
}