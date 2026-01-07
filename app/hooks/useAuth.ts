"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
    const router = useRouter();
    const { token, isAuthenticated, login, logout, initAuth } = useAuthStore();

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    const requireAuth = () => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    };

    return {
        token,
        isAuthenticated,
        login,
        logout,
        requireAuth,
    };
};
