"use client";

import { useState } from "react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/auth.store";
import { useRouter } from "next/navigation";

interface NameInputProps {
    phone: string;
}

export default function NameInput({ phone }: NameInputProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const router = useRouter();

    const handleRegister = async () => {
        if (!name.trim()) {
            toast.error("Please enter your name");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/api/login-register/", { name, phone_number: phone });
            login(res.data.token.access, name);
            toast.success("Registered successfully!");
            setTimeout(() => router.push("/"), 1000);
        } catch (err) {
            console.error("Registration error:", err);
            toast.error("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-black flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-medium text-white text-center mb-8">Welcome, You are?</h2>

                <label className="block text-white text-sm mb-3">Name</label>

                <input
                    type="text"
                    placeholder="Eg: John Mathew"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-zinc-900 text-white text-base rounded-xl mb-8 focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder-gray-500"
                />

                <button
                    onClick={handleRegister}
                    disabled={loading || !name.trim()}
                    className="w-full bg-white text-black cursor-pointer font-medium py-4 rounded-full disabled:bg-gray-700 disabled:text-gray-500 hover:bg-gray-100 transition-colors"
                >
                    {loading ? "Registering..." : "Continue"}
                </button>
            </div>
        </div>
    );
}