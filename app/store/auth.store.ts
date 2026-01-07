import { create } from "zustand";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isAuthenticated: false,

    login: (token) => {
        localStorage.setItem("access_token", token);
        set({ token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("access_token");
        set({ token: null, isAuthenticated: false });
    },

    initAuth: () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            set({ token, isAuthenticated: true });
        }
    },
}));
