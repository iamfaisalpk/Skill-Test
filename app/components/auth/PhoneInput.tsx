"use client";

import { useState } from "react";
import OtpInput from "./OtpInput";

export default function PhoneInput() {
    const [phone, setPhone] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [staticOtp, setStaticOtp] = useState("");

    const handleSendOtp = async () => {
        if (!phone) return alert("Enter phone number");

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setStaticOtp(otp);

        const existingUser = parseInt(phone.slice(-1)) % 2 === 0;

        setOtpSent(true);
        setUserExists(existingUser);

        alert(`Static OTP for testing: ${otp}`);
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-black">
            {!otpSent ? (
                <>
                    <h2 className="text-xl font-bold mb-4">Login with Phone</h2>
                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mb-4"
                    />
                    <button
                        onClick={handleSendOtp}
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                    >
                        Send OTP
                    </button>
                </>
            ) : (
                <OtpInput
                    phone={phone}
                    userExists={userExists}
                    staticOtp={staticOtp}
                />
            )}
        </div>
    );
}
