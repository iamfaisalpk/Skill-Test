"use client";
import { useEffect, useState, useCallback } from "react";
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

export default function ProfilePage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    const getDeletedIds = useCallback((): string[] => {
        const saved = localStorage.getItem("deleted_order_ids");
        return saved ? JSON.parse(saved) : [];
    }, []);

    const markAsDeleted = useCallback((orderId: string) => {
        const deleted = getDeletedIds();
        if (!deleted.includes(orderId)) {
            deleted.push(orderId);
            localStorage.setItem("deleted_order_ids", JSON.stringify(deleted));
        }
    }, [getDeletedIds]);

    useEffect(() => {
        const loadMyOrders = async () => {
            let myOrders: Order[] = [];

            // Step 1: Load ALL confirmed orders from localStorage
            const allOrdersJson = localStorage.getItem("all_orders");
            if (allOrdersJson) {
                try {
                    const localOrders: Order[] = JSON.parse(allOrdersJson);
                    // Add all confirmed orders with selected_color
                    localOrders.forEach(order => {
                        if (order.selected_color && order.is_confirmed) {
                            myOrders.push(order);
                        }
                    });
                } catch (parseError) {
                    console.error("Failed to parse all_orders", parseError);
                }
            }

            // Step 2: Load orders from API
            try {
                const response = await api.get("/api/user-orders/");
                let apiOrders: Order[] = [];

                if (Array.isArray(response.data)) {
                    apiOrders = response.data;
                } else if (response.data.orders) {
                    apiOrders = response.data.orders;
                }

                // Add API orders that aren't duplicates
                apiOrders.forEach((order) => {
                    if (order.selected_color && !myOrders.some((o) => o.id === order.id)) {
                        myOrders.push(order);
                    }
                });
            } catch {
                console.log("API not available - showing local orders only");
            }


            // Step 3: Filter out deleted orders
            const deletedIds = getDeletedIds();
            myOrders = myOrders.filter((order) => {
                if (!order.id) return true;
                return !deletedIds.includes(order.id);
            });

            // Sort by created_at (newest first)
            myOrders.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return dateB - dateA;
            });

            setOrders(myOrders);
            setLoading(false);
        };

        loadMyOrders();
    }, [getDeletedIds]);

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
            } catch (deleteError) {
                // Silently handle 404 and other API errors
                // The API endpoint might not exist yet, so we'll just delete locally
                console.log("API deletion failed, removing locally:", deleteError);
                markAsDeleted(orderToDelete.id);
                toast.success("Order removed");
            }

            // Also remove from localStorage all_orders
            const allOrdersJson = localStorage.getItem("all_orders");
            if (allOrdersJson) {
                try {
                    let allOrders: Order[] = JSON.parse(allOrdersJson);
                    allOrders = allOrders.filter(o => o.id !== orderToDelete.id);
                    localStorage.setItem("all_orders", JSON.stringify(allOrders));
                } catch (storageError) {
                    console.error("Failed to update all_orders", storageError);
                }
            }
        } else {
            toast.success("Order removed");
        }

        // Remove from local state
        setOrders((prev) => prev.filter((o) => o !== orderToDelete));
        setOrderToDelete(null);
    };

    return (
        <div className="min-h-screen bg-black text-white py-8 sm:py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-2">
                    <h1 className="text-3xl sm:text-4xl font-bold">My Orders</h1>
                    <p className="text-gray-400 text-sm sm:text-base">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                        <p className="text-gray-400 text-base sm:text-lg">Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-base sm:text-lg px-4">
                            No orders yet. Go buy some shoes!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {orders.map((order, index) => {
                            const color = order.selected_color || "green";
                            const shoeImage = COLOR_IMAGES[color];
                            const bgCircleClass = COLOR_BG_CLASS[color];
                            const key = order.id || `local-${index}-${order.created_at}`;

                            return (
                                <div
                                    key={key}
                                    className="bg-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xl relative group transition-all duration-300 hover:shadow-2xl"
                                >
                                    <button
                                        onClick={() => setOrderToDelete(order)}
                                        className="absolute top-3 sm:top-6 right-3 sm:right-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 p-2 sm:p-3 bg-red-600 hover:bg-red-700 rounded-full cursor-pointer z-10"
                                        aria-label="Delete order"
                                    >
                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>

                                    <div className={`relative w-28 h-28 sm:w-32 sm:h-32 ${bgCircleClass} rounded-full flex items-center justify-center overflow-hidden shrink-0`}>
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

                                    <div className="flex-1 text-center sm:text-left w-full pr-0 sm:pr-10">
                                        <h3 className="text-lg sm:text-xl font-semibold">
                                            {order.product_name}
                                        </h3>
                                        <p className="text-gray-400 mt-1 text-sm sm:text-base">
                                            {order.variation_details || "UK 7"}
                                        </p>
                                        <p className="text-gray-500 mt-3 sm:mt-4 text-xs sm:text-sm">
                                            {formatDateTime(order.created_at)}
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
                            );
                        })}
                    </div>
                )}
            </div>

            {orderToDelete && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg sm:text-xl font-bold mb-4">Delete This Order?</h3>
                        <div className="mb-6 flex items-center gap-3 sm:gap-4">
                            <div className={`relative w-16 h-16 sm:w-20 sm:h-20 ${COLOR_BG_CLASS[orderToDelete.selected_color || "green"]} rounded-full overflow-hidden shrink-0`}>
                                <Image
                                    src={COLOR_IMAGES[orderToDelete.selected_color || "green"]}
                                    alt={`${orderToDelete.product_name} preview`}
                                    width={150}
                                    height={150}
                                    className="object-contain scale-150"
                                    unoptimized
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm sm:text-base truncate">
                                    {orderToDelete.product_name}
                                </p>
                                <p className="text-gray-400 text-xs sm:text-sm">
                                    {orderToDelete.variation_details || "UK 7"}
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-6 sm:mb-8 text-sm">
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 sm:gap-4">
                            <button
                                onClick={() => setOrderToDelete(null)}
                                className="flex-1 py-2.5 sm:py-3 cursor-pointer rounded-xl border border-gray-600 hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 sm:py-3 cursor-pointer rounded-xl bg-red-600 hover:bg-red-700 transition-colors duration-200 font-medium text-sm sm:text-base"
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