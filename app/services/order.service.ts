import api from "../lib/api";

export const purchaseProduct = async (payload: {
    product_id?: string;
    variation_product_id?: string;
}) => {
    const { data } = await api.post("/api/purchase-product/", payload);
    return data;
};
