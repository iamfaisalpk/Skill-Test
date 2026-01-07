import api from "../lib/api";
import { API_ENDPOINTS } from "../lib/endpoints";


export const purchaseProduct = async (
    payload: { product_id?: string; variation_product_id?: string }
) => {
    const { data } = await api.post(
        API_ENDPOINTS.PURCHASE_PRODUCT,
        payload
    );
    return data;
};

export const getUserOrders = async () => {
    const { data } = await api.get(API_ENDPOINTS.USER_ORDERS);
    return data;
};
