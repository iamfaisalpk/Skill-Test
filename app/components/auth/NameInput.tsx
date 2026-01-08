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
        if (!name) return toast.error("Enter your name");

        setLoading(true);
        try {
            const res = await api.post("/api/login-register/", { name, phone_number: phone });
            login(res.data.token.access, name);
            toast.success("Registered successfully!");
            router.push("/");
        } catch (err) {
            console.error(err);
            toast.error("Registration failed");
        }
        setLoading(false);
    };

    return (
        <>
            <h2 className="text-xl font-bold mb-4">Welcome, You are?</h2>
            <input
                type="text"
                placeholder="Eg. John Mathew"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded mb-4 text-white"
            />
            <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded hover:bg-gray-200 transition cursor-pointer"
            >
                {loading ? "Registering..." : "Continue"}
            </button>
        </>
    );
}