"use client";

import { useState } from "react";
import OtpInput from "./OtpInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import basketballImg from "../../../public/images/basketboll.jpg";

export default function PhoneInputComponent() {
    const [phone, setPhone] = useState<string>("");
    const [otpSent, setOtpSent] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [staticOtp, setStaticOtp] = useState("");

    const handlePhoneChange = (value: string | undefined) => {
        setPhone(value || "");
    };

    const handleSendOtp = () => {
        if (!phone) {
            toast.error("Please enter your phone number", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (!isValidPhoneNumber(phone)) {
            toast.error("Invalid phone number. Please enter a complete number (e.g., 10 digits for India)", {
                position: "top-right",
                autoClose: 4500,
            });
            return;
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setStaticOtp(otp);

        const lastDigit = parseInt(phone.slice(-1), 10);
        const isExisting = !isNaN(lastDigit) && lastDigit % 2 === 0;
        setUserExists(isExisting);

        toast.info(`Your OTP (testing): ${otp}`, {
            position: "top-right",
            autoClose: 8000,
        });

        setOtpSent(true);
    };

    const handleResendOtp = () => {
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setStaticOtp(newOtp);
        toast.info(`New OTP (testing): ${newOtp}`, {
            position: "top-right",
            autoClose: 8000,
        });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            {!otpSent ? (
                <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8">
                    <div className="flex flex-col lg:flex-row w-full max-w-6xl overflow-hidden rounded-none lg:rounded-2xl shadow-2xl border border-gray-900">
                        <div className="relative w-full lg:w-1/2 h-80 lg:h-auto">
                            <Image
                                src={basketballImg}
                                alt="Basketball player dunking"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="w-full lg:w-1/2 bg-black text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-2">Log In</h2>
                            <p className="text-gray-400 mb-10">Enter your phone number to continue</p>

                            <div className="mt-6">
                                <label className="block text-sm font-medium mb-3 text-gray-300">
                                    Phone Number
                                </label>
                                <PhoneInput
                                    international
                                    defaultCountry="IN"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="Enter phone number"
                                    className="custom-phone-input"
                                />
                            </div>

                            <button
                                onClick={handleSendOtp}
                                className="w-full bg-white cursor-pointer text-black font-semibold py-4 rounded-lg hover:bg-gray-200 transition duration-300 mt-10 text-lg"
                            >
                                Continue
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-8">
                                By continuing, you agree to our Terms & Privacy Policy
                            </p>
                        </div>
                    </div>

                    <style jsx global>{`
                        .custom-phone-input {
                            display: flex;
                            width: 100%;
                        }

                        .custom-phone-input .PhoneInputCountry {
                            margin-right: 12px;
                        }

                        .custom-phone-input .PhoneInputCountrySelect {
                            background: #161616;
                            border: 1px solid #333;
                            border-radius: 10px;
                            padding: 16px 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-width: 90px;
                        }

                        .custom-phone-input .PhoneInputCountryIcon {
                            width: 28px;
                            height: 28px;
                            border-radius: 4px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                        }

                        .custom-phone-input .PhoneInputCountrySelectArrow {
                            border: solid #9ca3af;
                            border-width: 0 2px 2px 0;
                            display: inline-block;
                            padding: 3px;
                            transform: rotate(45deg);
                            margin-left: 8px;
                            margin-bottom: 3px;
                            opacity: 0.8;
                        }

                        .custom-phone-input .PhoneInputInput {
                            background: #161616;
                            border: 1px solid #333;
                            color: white;
                            padding: 16px 18px;
                            border-radius: 10px;
                            font-size: 16px;
                            flex: 1;
                            outline: none;
                            transition: all 0.2s;
                        }

                        .custom-phone-input .PhoneInputInput:focus {
                            border-color: #ffffff;
                            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.15);
                        }

                        .custom-phone-input .PhoneInputInput::placeholder {
                            color: #6b7280;
                        }
                    `}</style>
                </div>
            ) : (
                <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
                    <div className="w-full max-w-md p-8 bg-black rounded-2xl shadow-2xl border border-gray-800">
                        <OtpInput
                            phone={phone}
                            userExists={userExists}
                            staticOtp={staticOtp}
                            onResend={handleResendOtp}
                        />
                    </div>
                </div>
            )}
        </>
    );
}