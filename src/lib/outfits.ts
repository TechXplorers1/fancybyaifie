import { Product } from '@/lib/products';

export interface Outfit {
  id: string;
  name: string;
  description: string;
  image: string;
  items: Product[];
}

export const outfits: Outfit[] = []
