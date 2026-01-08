"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import BuyNowButton from "./BuyNowButton";
import { Product } from "@/app/types/product";
import { useGSAPHover } from "@/app/hooks/useGSAPHover";

interface Props {
    product: Product;
    defaultColor: "green" | "vilot" | "red" | "pink";
}

const COLOR_IMAGES: Record<string, string> = {
    green: "/images/green.png",
    vilot: "/images/vilot.png",
    red: "/images/red.png",
    pink: "/images/pink.png",
};

const COLOR_BG: Record<string, string> = {
    green: "bg-lime-400",
    vilot: "bg-purple-600",
    red: "bg-red-600",
    pink: "bg-pink-400",
};

const COLOR_SWATCH: Record<string, string> = {
    green: "bg-lime-500",
    vilot: "bg-purple-700",
    red: "bg-red-500",
    pink: "bg-pink-400",
};

const AVAILABLE_SIZES = ["7", "8", "9", "10"];

type ColorKey = "green" | "vilot" | "red" | "pink";

export default function ProductCard({ product, defaultColor }: Props) {
    const cardRef = useRef<HTMLDivElement>(null);
    const shoeRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    const [hovered, setHovered] = useState(false);
    const [selectedSize, setSelectedSize] = useState("7");
    const [selectedColor, setSelectedColor] = useState<ColorKey>(defaultColor);

    useGSAPHover(cardRef);

    useEffect(() => {
        if (!shoeRef.current || !infoRef.current || !titleRef.current) return;

        if (hovered) {
            gsap.to(shoeRef.current, { y: -40, rotation: -25, duration: 0.6, ease: "power3.out" });
            gsap.to(titleRef.current, { opacity: 0, y: -20, duration: 0.3, ease: "power2.out" });
            gsap.to(infoRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.2 });
        } else {
            gsap.to(shoeRef.current, { y: 0, rotation: -15, duration: 0.6, ease: "power3.out" });
            gsap.to(titleRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.1 });
            gsap.to(infoRef.current, { opacity: 0, y: 30, duration: 0.3, ease: "power2.out" });
        }
    }, [hovered]);

    useEffect(() => {
        if (!circleRef.current) return;

        const targetColor =
            selectedColor === "green" ? "#a3e635" :
                selectedColor === "vilot" ? "#9333ea" :
                    selectedColor === "red" ? "#dc2626" :
                        "#f472b6";

        gsap.to(circleRef.current, {
            backgroundColor: targetColor,
            duration: 0.8,
            ease: "power2.inOut",
        });
    }, [selectedColor]);

    const bgColorClass = COLOR_BG[selectedColor];
    const title = selectedColor === "pink" ? "DUNK 3.0" : "NIKE SHOES";

    return (
        <div
            ref={cardRef}
            className="relative overflow-hidden bg-zinc-900 text-white w-full max-w-md h-120 mx-auto shadow-2xl transition-shadow duration-300 hover:shadow-3xl"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                ref={circleRef}
                className={`absolute top-0 left-0 w-64 h-64 ${bgColorClass} rounded-br-full transition-colors duration-800`}
            />

            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                <span className="text-9xl font-black tracking-tighter text-gray-500 opacity-10">NIKE</span>
            </div>

            <div className="relative z-10 flex justify-center items-center h-60 pt-4">
                <div ref={shoeRef} className="w-full max-w-xs px-4" style={{ transform: "rotate(-15deg)" }}>
                    <Image
                        src={COLOR_IMAGES[selectedColor]}
                        alt={`Nike shoe in ${selectedColor}`}
                        width={500}
                        height={400}
                        className="object-contain drop-shadow-2xl w-full h-auto"
                        unoptimized
                        priority
                    />
                </div>
            </div>

            <div ref={titleRef} className="relative z-20 text-center px-6 mt-8">
                <h3 className="text-3xl font-black uppercase tracking-wide">{title}</h3>
            </div>

            <div
                ref={infoRef}
                className="absolute inset-x-0 bottom-0 z-30 opacity-0 translate-y-8 text-center space-y-4 px-6 pb-10"
            >
                <div>
                    <p className="text-xs uppercase tracking-widest mb-2 font-bold">Size:</p>
                    <div className="flex justify-center gap-2">
                        {AVAILABLE_SIZES.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-md font-bold text-base transition-all duration-200 ${selectedSize === size
                                        ? "bg-white text-black"
                                        : "bg-transparent text-white border-2 border-white/40 hover:border-white/70"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-widest mb-2 font-bold">Color:</p>
                    <div className="flex justify-center gap-2">
                        {(["green", "vilot", "red"] as ColorKey[]).map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-6 h-6 rounded-full ${COLOR_SWATCH[color]} transition-all duration-200 ${selectedColor === color
                                        ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                                        : "ring-0 hover:scale-105"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <BuyNowButton
                        productId={product.id}
                        variationId={
                            product.variations?.find((v) => v.color === selectedColor)?.id ||
                            product.variations?.[0]?.id
                        }
                        selectedColor={selectedColor}
                    />
                </div>
            </div>
        </div>
    );
}