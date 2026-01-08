"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import api from "@/app/lib/api";
import { Trash2 } from "lucide-react";

interface Order {
    id?: string;
    product_name: string;
    variation_details?: string;
    total_amount: number;
    original_price?: number;
    created_at: string;
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

export default function ProfilePage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    const getDeletedIds = (): string[] => {
        const saved = localStorage.getItem("deleted_order_ids");
        return saved ? JSON.parse(saved) : [];
    };

    const markAsDeleted = (orderId: string) => {
        const deleted = getDeletedIds();
        if (!deleted.includes(orderId)) {
            deleted.push(orderId);
            localStorage.setItem("deleted_order_ids", JSON.stringify(deleted));
        }
    };

    useEffect(() => {
        const loadMyOrders = async () => {
            let myOrders: Order[] = [];

            // Only fetch orders from API - remove localStorage logic
            try {
                const response = await api.get("/api/user-orders/");
                let apiOrders: Order[] = [];
                
                if (Array.isArray(response.data)) {
                    apiOrders = response.data;
                } else if (response.data.orders) {
                    apiOrders = response.data.orders;
                }

                apiOrders.forEach((order) => {
                    if (order.selected_color) {
                        myOrders.push(order);
                    }
                });
            } catch (error) {
                console.log("Failed to load orders from API:", error);
            }

            // Filter out deleted orders
            const deletedIds = getDeletedIds();
            myOrders = myOrders.filter((order) => {
                if (!order.id) return true;
                return !deletedIds.includes(order.id);
            });

            setOrders(myOrders);
            setLoading(false);
        };

        loadMyOrders();
    }, []);

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "short",
            year: "numeric",
        }).replace(",", "");
    };

    const handleDelete = async () => {
        if (!orderToDelete) return;

        // If order has an ID, try to delete from backend
        if (orderToDelete.id) {
            try {
                await api.delete(`/api/user-orders/${orderToDelete.id}/`);
                toast.success("Order deleted successfully");
            } catch (error) {
                console.error("Failed to delete order from backend:", error);
                // Still mark as deleted locally if backend fails
                markAsDeleted(orderToDelete.id);
                toast.success("Order removed");
            }
        }

        // Remove from local state
        setOrders((prev) => prev.filter((o) => o !== orderToDelete));
        setOrderToDelete(null);
    };

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold">My Orders</h1>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No orders yet. Go buy some shoes!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => {
                            const color = order.selected_color || "green";
                            const shoeImage = COLOR_IMAGES[color];
                            const bgCircleClass = COLOR_BG_CLASS[color];
                            const key = order.id || `local-${index}-${order.product_name}`;

                            return (
                                <div
                                    key={key}
                                    className="bg-gray-900 rounded-3xl p-6 flex items-center gap-6 shadow-xl relative group transition-all duration-300 hover:shadow-2xl"
                                >
                                    <button
                                        onClick={() => setOrderToDelete(order)}
                                        className="absolute top-6 cursor-pointer right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 bg-red-600 hover:bg-red-700 rounded-full"
                                        aria-label="Delete order"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className={`relative w-32 h-32 ${bgCircleClass} rounded-full flex items-center justify-center overflow-hidden`}>
                                        <Image
                                            src={shoeImage}
                                            alt={`${order.product_name} in ${color} color`}
                                            width={200}
                                            height={200}
                                            className="object-contain scale-150"
                                            priority
                                            unoptimized
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">{order.product_name}</h3>
                                        <p className="text-gray-400 mt-1">
                                            {order.variation_details || "UK 7"}
                                        </p>
                                        <p className="text-gray-500 mt-4 text-sm">
                                            {formatDateTime(order.created_at)}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xl font-bold">₹{order.total_amount}</p>
                                        {order.original_price && (
                                            <p className="text-sm text-gray-500 line-through">
                                                ₹{order.original_price}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {orderToDelete && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Delete This Order?</h3>
                        <div className="mb-6 flex items-center gap-4">
                            <div className={`relative w-20 h-20 ${COLOR_BG_CLASS[orderToDelete.selected_color || "green"]} rounded-full overflow-hidden`}>
                                <Image
                                    src={COLOR_IMAGES[orderToDelete.selected_color || "green"]}
                                    alt={`${orderToDelete.product_name} preview`}
                                    width={150}
                                    height={150}
                                    className="object-contain scale-150"
                                    unoptimized
                                />
                            </div>
                            <div>
                                <p className="font-semibold">{orderToDelete.product_name}</p>
                                <p className="text-gray-400 text-sm">{orderToDelete.variation_details || "UK 7"}</p>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-8">This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setOrderToDelete(null)}
                                className="flex-1 py-3 cursor-pointer rounded-xl border border-gray-600 hover:bg-gray-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-3 cursor-pointer rounded-xl bg-red-600 hover:bg-red-700 transition font-medium"
                            >
                                Delete Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}