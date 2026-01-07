"use client";

import { useAuthStore } from "../../store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const initAuth = useAuthStore((s) => s.initAuth);
    const router = useRouter();

    useEffect(() => {
        initAuth();
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated]);

    return <>{children}</>;
}
