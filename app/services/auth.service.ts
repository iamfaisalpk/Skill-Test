import api from "../lib/api";
import { API_ENDPOINTS } from "../lib/endpoints";


export const verifyUser = async (phone_number: string) => {
    const { data } = await api.post(API_ENDPOINTS.VERIFY_USER, {
        phone_number,
    });
    return data;
};

export const registerUser = async (
    name: string,
    phone_number: string,
    unique_id?: string
) => {
    const { data } = await api.post(API_ENDPOINTS.REGISTER, {
        name,
        phone_number,
        unique_id,
    });
    return data;
};
