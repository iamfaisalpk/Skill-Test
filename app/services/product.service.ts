import api from "@/app/lib/api";
import { API_ENDPOINTS } from "@/app/lib/endpoints";
import { Product } from "@/app/types/product";

export const getNewProducts = async (): Promise<Product[]> => {
    const { data } = await api.get(API_ENDPOINTS.NEW_PRODUCTS);

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    return [];
};
