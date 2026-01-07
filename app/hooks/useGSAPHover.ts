"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";

export const useGSAPHover = (ref: RefObject<HTMLElement | null>) => {
    useEffect(() => {
        if (!ref.current) return;

        const el = ref.current;

        const enter = () => {
            gsap.to(el, { scale: 1.03, duration: 0.3 });
        };

        const leave = () => {
            gsap.to(el, { scale: 1, duration: 0.3 });
        };

        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);

        return () => {
            el.removeEventListener("mouseenter", enter);
            el.removeEventListener("mouseleave", leave);
        };
    }, [ref]);
};
