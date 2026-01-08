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
    created_at?: string;
    is_confirmed?: boolean;
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
        const processOrder = () => {
            const saved = localStorage.getItem("last_order");
            if (!saved) {
                router.replace("/");
                return;
            }

            try {
                const parsed: OrderData = JSON.parse(saved);

                // CRITICAL: Mark order as confirmed and add timestamp
                const confirmedOrder = {
                    ...parsed,
                    is_confirmed: true,
                    created_at: parsed.created_at || new Date().toISOString()
                };

                // Get existing orders list
                const existingOrdersJson = localStorage.getItem("all_orders");
                let allOrders: OrderData[] = [];

                if (existingOrdersJson) {
                    try {
                        allOrders = JSON.parse(existingOrdersJson);
                    } catch {
                        allOrders = [];
                    }
                }

                // Add new order to the list (avoid duplicates by checking id)
                const existingIndex = allOrders.findIndex(o => o.id === confirmedOrder.id);
                if (existingIndex >= 0) {
                    // Update existing order
                    allOrders[existingIndex] = confirmedOrder;
                } else {
                    // Add new order to beginning of list (newest first)
                    allOrders.unshift(confirmedOrder);
                }

                // Save all orders back to localStorage
                localStorage.setItem("all_orders", JSON.stringify(allOrders));

                // Also keep last_order for backward compatibility
                localStorage.setItem("last_order", JSON.stringify(confirmedOrder));

                // Set order state after all localStorage operations
                setOrder(confirmedOrder);
            } catch {
                router.replace("/");
            }
        };

        processOrder();
    }, [router]);

    if (!order) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

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
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8 text-white">
            <div className="w-full max-w-md flex flex-col items-center">
                <Image
                    src={"/images/shoeImage.png"}
                    alt="Nike"
                    width={140}
                    height={80}
                    className="mb-8 sm:mb-12"
                    priority
                />

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-center">
                    Successfully Ordered!
                </h1>
                <p className="text-gray-400 mb-12 sm:mb-16 text-base sm:text-lg text-center">
                    {formatDateTime()}
                </p>

                <div className="w-full bg-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-2xl">
                    <div className={`relative w-28 h-28 sm:w-32 sm:h-32 ${bgCircleClass} rounded-full flex items-center justify-center overflow-hidden shrink-0`}>
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

                    <div className="flex-1 text-center sm:text-left w-full">
                        <h3 className="text-lg sm:text-xl font-semibold">
                            {order.product_name || "Nike Shoe"}
                        </h3>
                        <p className="text-gray-400 mt-1 text-sm sm:text-base">
                            {order.variation_details || "UK 7"}
                        </p>
                    </div>

                    <div className="text-center sm:text-right w-full sm:w-auto">
                        <p className="text-xl font-bold">₹{order.total_amount}</p>
                        {order.original_price && (
                            <p className="text-sm text-gray-500 line-through">
                                ₹{order.original_price}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => router.push("/profile")}
                    className="mt-8 sm:mt-12 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-xl font-medium cursor-pointer hover:bg-gray-200 transition-colors duration-200 w-full sm:w-auto text-center"
                >
                    View My Orders
                </button>
            </div>
        </div>
    );
}