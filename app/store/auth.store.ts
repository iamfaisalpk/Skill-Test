import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
    token: string | null;
    user: {
        name?: string;
        phone?: string;
    } | null;
    login: (token: string, user?: AuthState["user"]) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,

    login: (token, user) => {
        Cookies.set("access_token", token);
        set({ token, user });
    },

    logout: () => {
        Cookies.remove("access_token");
        set({ token: null, user: null });
    },
}));
