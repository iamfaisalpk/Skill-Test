
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";
import { toast } from "react-toastify";
import NameInput from "./NameInput";

interface OtpInputProps {
    phone: string;
    userExists: boolean;
    staticOtp: string;
    onResend: () => void;
}

export default function OtpInput({ phone, userExists, staticOtp, onResend }: OtpInputProps) {
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const [verified, setVerified] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const router = useRouter();
    const { login } = useAuthStore();
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleVerifySuccess = useCallback(() => {
        setVerified(true);
        toast.success("OTP Verified Successfully!");

        if (userExists) {
            login("existing_user_jwt_token", "Existing User");
            setTimeout(() => router.push("/"), 1000);
        }
    }, [userExists, login, router]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleResend = useCallback(() => {
        if (!canResend) return;

        onResend();

        setResendTimer(30);
        setCanResend(false);
        setOtp(["", "", "", ""]);
        inputsRef.current[0]?.focus();
    }, [canResend, onResend]);

    const handleChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }

        if (newOtp.every(digit => digit !== "")) {
            const enteredOtp = newOtp.join("");
            if (enteredOtp === staticOtp) {
                handleVerifySuccess();
            } else {
                toast.error("Incorrect OTP");
                setOtp(["", "", "", ""]);
                inputsRef.current[0]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleManualVerify = () => {
        const enteredOtp = otp.join("");
        if (enteredOtp === staticOtp) {
            handleVerifySuccess();
        } else {
            toast.error("Incorrect OTP");
        }
    };

    return (
        <div className="w-full min-h-screen bg-black flex flex-col justify-center items-center px-6">
            {!verified ? (
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-medium text-white text-center mb-2">Verify phone</h2>
                    <p className="text-gray-400 text-sm text-center mb-8">
                        Enter the OTP sent to {phone}
                    </p>

                    <label className="block text-white text-sm mb-3">Enter OTP</label>

                    <div className="flex justify-center gap-3 mb-6">
                        {[0, 1, 2, 3].map((i) => (
                            <input
                                key={i}
                                ref={(el) => {
                                    inputsRef.current[i] = el;
                                }}
                                type="text"
                                maxLength={1}
                                value={otp[i]}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                className="w-20 h-14 bg-zinc-900 text-white text-2xl text-center rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-600"
                                autoFocus={i === 0}
                            />
                        ))}
                    </div>

                    <div className="text-left mb-8">
                        {canResend ? (
                            <button
                                onClick={handleResend}
                                className="text-gray-400 cursor-pointer text-sm hover:text-gray-300"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <p className="text-gray-400 text-sm cursor-pointer">
                                Resend OTP in {resendTimer}s
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleManualVerify}
                        disabled={otp.some(digit => digit === "")}
                        className="w-full bg-white cursor-pointer text-black font-medium py-4 rounded-full disabled:bg-gray-700 disabled:text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        Verify
                    </button>
                </div>
            ) : !userExists ? (
                <NameInput phone={phone} />
            ) : null}
        </div>
    );
}