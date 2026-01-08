import { create } from "zustand";

interface AuthState {
    token: string | null;
    name: string | null;
    isAuthenticated: boolean;
    login: (token: string, name: string) => void;
    logout: () => void;
    initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    name: null,
    isAuthenticated: false,

    login: (token, name) => {
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_name", name);
        set({ token, name, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_name");
        set({ token: null, name: null, isAuthenticated: false });
    },

    initAuth: () => {
        const token = localStorage.getItem("access_token");
        const name = localStorage.getItem("user_name");
        if (token) {
            set({ token, name, isAuthenticated: true });
        }
    },
}));