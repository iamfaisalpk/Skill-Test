// src/lib/auth.ts

const ACCESS_TOKEN_KEY = "access_token";

export const setAccessToken = (token: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
};

export const getAccessToken = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
};

export const removeAccessToken = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
};

export const isAuthenticated = (): boolean => {
    return !!getAccessToken();
};
