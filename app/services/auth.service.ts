import api from "../lib/api";

export const verifyUser = async (phone: string) => {
    const { data } = await api.post("/api/verify/", {
        phone_number: phone,
    });
    return data;
};

export const registerUser = async ({
    phone_number,
    name,
}: {
    phone_number: string;
    name: string;
}) => {
    const { data } = await api.post("/api/login-register/", {
        phone_number,
        name,
    });
    return data;
};
