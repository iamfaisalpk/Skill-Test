export interface ProductVariation {
    id: string;
    color?: string;
    size?: string;
    price?: number;
    image?: string;
    stock?: number;
}

export interface Product {
    id: string;
    name: string;
    image: string;
    brand_logo?: string;
    base_price?: number;
    variations?: ProductVariation[];
}
