"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OrderData {
    id: string;
    product_name?: string;
    variation_details?: string;
    total_amount: number;
    original_price?: number;
    selected_color?: "green" | "vilot" | "red" | "pink";
}

const COLOR_IMAGES: Record<string, string> = {
    green: "/images/green.png",
    vilot: "/images/vilot.png",
    red: "/images/red.png",
    pink: "/images/pink.png",
};

const COLOR_BG_CLASS: Record<string, string> = {
    green: "bg-lime-400",
    vilot: "bg-purple-600",
    red: "bg-red-600",
    pink: "bg-pink-400",
};

export default function OrderSuccessPage() {
    const router = useRouter();
    const [order, setOrder] = useState<OrderData | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("last_order");
        if (!saved) {
            router.replace("/");
            return;
        }

        try {
            const parsed: OrderData = JSON.parse(saved);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOrder(parsed);
        } catch {
            router.replace("/");
        }
    }, [router]);

    if (!order) return null;

    const formatDateTime = () => {
        const now = new Date();
        return now.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "short",
            year: "numeric",
        }).replace(",", "");
    };

    const color = order.selected_color || "green";
    const shoeImage = COLOR_IMAGES[color];
    const bgCircleClass = COLOR_BG_CLASS[color];

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-white">
            <Image
                src={"/images/shoeImage.png"}
                alt="Nike"
                width={140}
                height={80}
                className="mb-12"
                priority
            />

            <h1 className="text-4xl md:text-5xl font-bold mb-2">Successfully Ordered!</h1>
            <p className="text-gray-400 mb-16 text-lg">{formatDateTime()}</p>

            <div className="w-full max-w-lg bg-gray-900 rounded-3xl p-6 flex items-center gap-6 shadow-2xl">
                <div className={`relative w-32 h-32 ${bgCircleClass} rounded-full flex items-center justify-center overflow-hidden`}>
                    <Image
                        src={shoeImage}
                        alt={order.product_name || "Nike Shoe"}
                        width={200}
                        height={200}
                        className="object-contain scale-150"
                        priority
                        unoptimized
                    />
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-semibold">{order.product_name || "Nike Shoe"}</h3>
                    <p className="text-gray-400 mt-1">{order.variation_details || "UK 7"}</p>
                </div>

                <div className="text-right">
                    <p className="text-xl font-bold">₹{order.total_amount}</p>
                    {order.original_price && (
                        <p className="text-sm text-gray-500 line-through">₹{order.original_price}</p>
                    )}
                </div>
            </div>

            <button
                onClick={() => router.push("/profile")}
                className="mt-12 px-8 py-4 bg-white text-black rounded-xl font-medium cursor-pointer hover:bg-gray-200 transition"
            >
                View My Orders
            </button>
        </div>
    );
}