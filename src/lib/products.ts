export interface Product {
  id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    affiliateLink?: string;
    imageHint: string;
}

export const products: Product[] = [];
