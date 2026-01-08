// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useAuthStore } from "@/app/store/auth.store";
// import api from "@/app/lib/api";

// interface Props {
//     productId?: string;
//     variationId?: string;
// }

// export default function BuyNowButton({ productId, variationId }: Props) {
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);
//     const { token, logout } = useAuthStore();

//     const handleBuyNow = async () => {
//         if (!token) {
//             toast.warn("Please login to continue");
//             router.push("/login");
//             return;
//         }

//         if (!productId && !variationId) {
//             toast.error("No product selected");
//             return;
//         }

//         setLoading(true);

//         try {
//             const payload: { product_id?: string; variation_product_id?: string } = {};
//             if (productId) payload.product_id = productId;
//             if (variationId) payload.variation_product_id = variationId;

//             const response = await api.post("/api/purchase-product/", payload);

//             localStorage.setItem("last_order", JSON.stringify(response.data.order));
//             toast.success("Order placed successfully!");
//             router.push("/order-success");
//         } catch (error: unknown) {
//             if (error instanceof Error && "response" in error) {
//                 const err = error as { response?: { status?: number; data?: { message?: string } } };
//                 if (err.response?.status === 401) {
//                     toast.error("Session expired. Logging out...");
//                     logout();
//                     localStorage.clear();
//                     router.push("/login");
//                     return;
//                 }
//                 toast.error(err.response?.data?.message || "Purchase failed");
//             } else {
//                 toast.error("Something went wrong. Please try again.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <button
//             onClick={handleBuyNow}
//             disabled={loading}
//             className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
//         >
//             {loading ? "Processing..." : "Buy Now"}
//         </button>
//     );
// }



"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/app/store/auth.store";
import api from "@/app/lib/api";

interface Props {
    productId?: string;
    variationId?: string;
    selectedColor?: "green" | "vilot" | "red" | "pink";
}

export default function BuyNowButton({ productId, variationId, selectedColor }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { token, logout } = useAuthStore();

    const handleBuyNow = async () => {
        if (!token) {
            toast.warn("Please login to continue");
            router.push("/login");
            return;
        }

        if (!productId && !variationId) {
            toast.error("No product selected");
            return;
        }

        setLoading(true);

        try {
            const payload: { product_id?: string; variation_product_id?: string } = {};
            if (productId) payload.product_id = productId;
            if (variationId) payload.variation_product_id = variationId;

            const response = await api.post("/api/purchase-product/", payload);

            // Save order + selected color for success & profile pages
            const enhancedOrder = {
                ...response.data.order,
                selected_color: selectedColor || "green",
            };

            localStorage.setItem("last_order", JSON.stringify(enhancedOrder));
            toast.success("Order placed successfully!");
            router.push("/order-success");
        } catch (error: unknown) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            if (err.response?.status === 401) {
                toast.error("Session expired. Logging out...");
                logout();
                localStorage.clear();
                router.push("/login");
                return;
            }
            toast.error(err.response?.data?.message || "Purchase failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleBuyNow}
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
            {loading ? "Processing..." : "Buy Now"}
        </button>
    );
}