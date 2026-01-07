"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const status = searchParams.get("status");

    useEffect(() => {
        if (!orderId) {
            router.replace("/");
        }
    }, [orderId, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#161616]">
            <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />

                <h1 className="text-2xl font-semibold text-gray-800">
                    Order Successful 🎉
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                    Thank you for your purchase
                </p>

                <div className="mt-6 rounded-lg bg-gray-100 p-4 text-left text-sm">
                    <p>
                        <span className="font-medium">Order ID:</span> {orderId}
                    </p>
                    <p className="mt-1">
                        <span className="font-medium">Payment Status:</span>{" "}
                        {status ?? "Paid"}
                    </p>
                    <p className="mt-1">
                        <span className="font-medium">Total Amount:</span> ₹{" "}
                        {amount ?? "--"}
                    </p>
                </div>

                <button
                    onClick={() => router.push("/profile")}
                    className="mt-6 w-full rounded-lg bg-black py-2 text-white hover:opacity-90"
                >
                    View My Orders
                </button>
            </div>
        </div>
    );
}
