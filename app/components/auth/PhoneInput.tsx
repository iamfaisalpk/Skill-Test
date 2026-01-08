"use client";

import { useState } from "react";
import OtpInput from "./OtpInput";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import basketballImg from "../../../public/images/basketboll.jpg";

export default function PhoneInput() {
    const [phone, setPhone] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [staticOtp, setStaticOtp] = useState("");

    const handleSendOtp = () => {
        if (!phone || phone.length < 10) {
            return toast.error("Please enter a valid phone number");
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setStaticOtp(otp);

        const lastDigit = parseInt(phone.slice(-1), 10);
        const existingUser = !isNaN(lastDigit) && lastDigit % 2 === 0;
        setUserExists(existingUser);
        setOtpSent(true);

        toast.info(`Static OTP for testing: ${otp}`);
    };

    return (
        <>
            <ToastContainer />
            {!otpSent ? (
                <div className="flex flex-col lg:flex-row max-w-5xl mx-auto mt-10 md:mt-20 overflow-hidden rounded-xl shadow-2xl">
                    <div className="relative w-full lg:w-1/2 h-64 lg:h-auto">
                        <Image
                            src={basketballImg}
                            alt="Basketball player dunking"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="w-full lg:w-1/2 bg-black text-white p-8 md:p-12 flex flex-col justify-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center lg:text-left">
                            Log in
                        </h2>
                        <label className="block text-sm mb-2">Phone</label>
                        <input
                            type="tel"
                            placeholder="Enter Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            maxLength={15}
                            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg mb-6 text-white focus:outline-none focus:border-white transition"
                        />
                        <button
                            onClick={handleSendOtp}
                            className="w-full bg-white text-black font-medium py-4 rounded-lg hover:bg-gray-100 transition duration-200 cursor-pointer"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-black flex items-center justify-center px-4">
                    <div className="max-w-md w-full p-8 bg-black rounded-xl shadow-2xl text-white">
                        <OtpInput phone={phone} userExists={userExists} staticOtp={staticOtp} />
                    </div>
                </div>
            )}
        </>
    );
}