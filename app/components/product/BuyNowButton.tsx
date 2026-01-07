"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
    productId?: string;
    variationId?: string;
}

export default function BuyNowButton({ productId, variationId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleBuyNow = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            alert("Please login to continue");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchase-product/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(
                        variationId
                            ? { variation_product_id: variationId }
                            : { product_id: productId }
                    ),
                }
            );

            if (!res.ok) {
                throw new Error("Purchase failed");
            }

            const data = await res.json();

            localStorage.setItem("last_order", JSON.stringify(data.order));

            router.push("/order-success");
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleBuyNow}
            disabled={loading}
            className="w-full rounded-lg cursor-pointer bg-black py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
            {loading ? "Processing..." : "Buy Now"}
        </button>
    );
}
