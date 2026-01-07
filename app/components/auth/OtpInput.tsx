"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";
import api from "../../lib/api";

interface OtpInputProps {
    phone: string;
    userExists: boolean;
    staticOtp: string;
}

export default function OtpInput({ phone, userExists, staticOtp }: OtpInputProps) {
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuthStore();

    const handleVerifyOtp = async () => {
        if (!otp) return alert("Enter OTP");

        if (otp !== staticOtp) return alert("Incorrect OTP");

        setLoading(true);

        try {
            if (userExists) {
                // Existing user: simulate token response
                login("existing_user_jwt_token");
            } else {
                // New user: send name and phone to API
                if (!name) return alert("Enter your name");

                const res = await api.post("/api/login-register/", { name, phone_number: phone });
                login(res.data.token.access);
            }

            router.push("/"); // redirect to homepage
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Enter OTP</h2>
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded mb-4"
            />
            {!userExists && (
                <>
                    <h3 className="mb-1">Your Name</h3>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mb-4"
                    />
                </>
            )}
            <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
            >
                {loading ? "Verifying..." : "Verify & Login"}
            </button>
        </div>
    );
}
