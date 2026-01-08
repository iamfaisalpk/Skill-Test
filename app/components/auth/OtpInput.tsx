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
}

export default function OtpInput({ phone, userExists, staticOtp }: OtpInputProps) {
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
            setTimeout(() => router.push("/"), 800);
        }
    }, [userExists, login, router]);

    // Timer countdown
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

        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        toast.info(`New OTP for testing: ${newOtp}`);

        setResendTimer(30);
        setCanResend(false);
        setOtp(["", "", "", ""]);
        inputsRef.current[0]?.focus();
    }, [canResend]);

    // Auto-verify directly on input change — NO EFFECT!
    const handleChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next
        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }

        // Auto-verify when all 4 digits are filled
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
        <div className="w-full">
            {!verified ? (
                <>
                    <h2 className="text-2xl font-bold mb-6 text-center">Verify phone</h2>
                    <p className="text-center text-gray-300 mb-8">
                        Enter the OTP sent to <span className="font-medium">{phone}</span>
                    </p>

                    <div className="flex justify-center gap-3 mb-8">
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
                                className="w-14 h-14 bg-gray-800 text-white text-3xl text-center rounded-lg border border-gray-600 focus:border-white focus:outline-none transition"
                                autoFocus={i === 0}
                            />
                        ))}
                    </div>

                    <div className="text-center mb-8">
                        {canResend ? (
                            <button
                                onClick={handleResend}
                                className="text-white underline hover:text-gray-300 transition"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <p className="text-gray-400">
                                Resend OTP in {resendTimer}s
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleManualVerify}
                        disabled={otp.some(digit => digit === "")}
                        className="w-full bg-white text-black font-medium py-4 rounded-lg hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 transition cursor-pointer"
                    >
                        Verify
                    </button>
                </>
            ) : !userExists ? (
                <NameInput phone={phone} />
            ) : null}
        </div>
    );
}