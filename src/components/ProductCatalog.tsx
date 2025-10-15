import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ExternalLink, Eye } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  sizes: string[];
  description: string;
  affiliateLink: string;
}

interface OutfitItem {
  name: string;
  category: string;
  price: number;
  image: string;
  affiliateLink: string;
}

interface ProductCatalogProps {
  activeCategory: string;
}

// Outfit breakdowns - items that make up each complete outfit
const outfitBreakdowns: Record<number, OutfitItem[]> = {
  101: [ // Casual Weekend Look
    {
      name: "Oversized Knit Sweater",
      category: "Top",
      price: 89,
      image: "https://images.unsplash.com/photo-1631541911232-72bc7448820a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHN3ZWF0ZXIlMjBrbml0fGVufDF8fHx8MTc1OTk5NzMxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/oversized-knit"
    },
    {
      name: "Relaxed Fit Jeans",
      category: "Bottom",
      price: 98,
      image: "https://images.unsplash.com/photo-1759163120690-b09c674bab82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWxheGVkJTIwamVhbnMlMjBkZW5pbXxlbnwxfHx8fDE3NTk5OTczMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/relaxed-jeans"
    },
    {
      name: "White Leather Sneakers",
      category: "Footwear",
      price: 125,
      image: "https://images.unsplash.com/photo-1573875133340-0b589f59a8c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwbWluaW1hbHxlbnwxfHx8fDE3NTk5MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/white-sneakers"
    }
  ],
  102: [ // Elegant Neutrals
    {
      name: "Silk Blend Blouse",
      category: "Top",
      price: 125,
      image: "https://images.unsplash.com/photo-1694232426671-56fcc32bf5b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjB3aGl0ZSUyMGNsb3RoaW5nfGVufDF8fHx8MTc1OTkwMjg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/silk-blouse"
    },
    {
      name: "Tailored Trousers",
      category: "Bottom",
      price: 145,
      image: "https://images.unsplash.com/photo-1758532758701-49b79820ba3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBvdXRmaXQlMjBjYXN1YWx8ZW58MXx8fHwxNzU5OTAyODgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/tailored-trousers"
    },
    {
      name: "Leather Ankle Boots",
      category: "Footwear",
      price: 215,
      image: "https://images.unsplash.com/photo-1570740566605-49bf22d0d79c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmtsZSUyMGJvb3RzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk4NDU0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/ankle-boots"
    }
  ],
  103: [ // Minimalist White
    {
      name: "White Cotton Tee",
      category: "Top",
      price: 45,
      image: "https://images.unsplash.com/photo-1618333314351-20b0d2d37948?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoaXJ0JTIwd29tZW58ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/white-tee"
    },
    {
      name: "Wide Leg White Pants",
      category: "Bottom",
      price: 128,
      image: "https://images.unsplash.com/photo-1758532758701-49b79820ba3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBvdXRmaXQlMjBjYXN1YWx8ZW58MXx8fHwxNzU5OTAyODgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/white-pants"
    },
    {
      name: "Minimal Leather Sandals",
      category: "Footwear",
      price: 98,
      image: "https://images.unsplash.com/photo-1584473457417-bd0afe798ae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kYWxzJTIwZmFzaGlvbiUyMHdvbWVufGVufDF8fHx8MTc1OTkyNTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/leather-sandals"
    },
    {
      name: "Beige Tote Bag",
      category: "Accessory",
      price: 145,
      image: "https://images.unsplash.com/photo-1749532972950-7367cb9a2f3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFnJTIwYmVpZ2V8ZW58MXx8fHwxNzU5OTk3MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/tote-bag"
    }
  ],
  104: [ // Cozy Comfort Set
    {
      name: "Cashmere Sweater",
      category: "Top",
      price: 165,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN3ZWF0ZXIlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTg0NTU3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/cashmere-sweater"
    },
    {
      name: "Wool Blend Joggers",
      category: "Bottom",
      price: 98,
      image: "https://images.unsplash.com/photo-1548126032-079166fba3e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHBhbnRzJTIwd29tZW58ZW58MXx8fHwxNzU5OTAyODc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/wool-joggers"
    },
    {
      name: "Suede Loafers",
      category: "Footwear",
      price: 168,
      image: "https://images.unsplash.com/photo-1732708874631-d14fbbe406c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2FmZXJzJTIwd29tZW4lMjBzaG9lc3xlbnwxfHx8fDE3NTk4NDA3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/suede-loafers"
    }
  ],
  105: [ // Professional Power
    {
      name: "Structured Blazer",
      category: "Top",
      price: 215,
      image: "https://images.unsplash.com/flagged/photo-1553802922-5f7e9934e328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGF6ZXIlMjB3b21lbiUyMGZhc2hpb258ZW58MXx8fHwxNzU5OTI1NzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/structured-blazer"
    },
    {
      name: "Silk Camisole",
      category: "Top",
      price: 78,
      image: "https://images.unsplash.com/photo-1694232426671-56fcc32bf5b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjB3aGl0ZSUyMGNsb3RoaW5nfGVufDF8fHx8MTc1OTkwMjg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/silk-cami"
    },
    {
      name: "High-Waist Trousers",
      category: "Bottom",
      price: 132,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHBhbnRzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk5MDI4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/highwaist-trousers"
    },
    {
      name: "Block Heel Pumps",
      category: "Footwear",
      price: 145,
      image: "https://images.unsplash.com/photo-1554062614-6da4fa67725a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWVscyUyMHNob2VzJTIwZWxlZ2FudHxlbnwxfHx8fDE3NTk5MjU3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/block-heels"
    }
  ],
  106: [ // Street Style Edge
    {
      name: "Graphic Tee",
      category: "Top",
      price: 55,
      image: "https://images.unsplash.com/photo-1618333314351-20b0d2d37948?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoaXJ0JTIwd29tZW58ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/graphic-tee"
    },
    {
      name: "Leather Jacket",
      category: "Outerwear",
      price: 395,
      image: "https://images.unsplash.com/photo-1711477270962-5bd8fd212540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwamFja2V0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk4ODU5ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/leather-jacket"
    },
    {
      name: "Black Skinny Jeans",
      category: "Bottom",
      price: 118,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHBhbnRzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk5MDI4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/skinny-jeans"
    },
    {
      name: "Combat Boots",
      category: "Footwear",
      price: 198,
      image: "https://images.unsplash.com/photo-1570740566605-49bf22d0d79c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmtsZSUyMGJvb3RzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk4NDU0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/combat-boots"
    }
  ],
  107: [ // Summer Breeze
    {
      name: "Linen Button-Up",
      category: "Top",
      price: 78,
      image: "https://images.unsplash.com/photo-1618333314351-20b0d2d37948?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoaXJ0JTIwd29tZW58ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/linen-button"
    },
    {
      name: "Linen Shorts",
      category: "Bottom",
      price: 72,
      image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9ydHMlMjB3b21lbnxlbnwxfHx8fDE3NTk5MDI4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/linen-shorts"
    },
    {
      name: "Canvas Espadrilles",
      category: "Footwear",
      price: 78,
      image: "https://images.unsplash.com/photo-1559504344-33abd17324d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BhZHJpbGxlcyUyMGZhc2hpb24lMjBzaG9lc3xlbnwxfHx8fDE3NTk5MjU3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/espadrilles"
    },
    {
      name: "Straw Hat",
      category: "Accessory",
      price: 68,
      image: "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXQlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTkwMjg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/straw-hat"
    }
  ],
  108: [ // Autumn Layers
    {
      name: "Turtleneck Sweater",
      category: "Top",
      price: 98,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN3ZWF0ZXIlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTg0NTU3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/turtleneck"
    },
    {
      name: "Wool Coat",
      category: "Outerwear",
      price: 285,
      image: "https://images.unsplash.com/photo-1721746033898-570230f0b1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHdpbnRlciUyMGNvYXR8ZW58MXx8fHwxNzU5OTA3NTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/wool-coat"
    },
    {
      name: "High-Waist Jeans",
      category: "Bottom",
      price: 125,
      image: "https://images.unsplash.com/photo-1612636676503-77f496c96ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBjbG90aGluZyUyMGJlaWdlfGVufDF8fHx8MTc1OTkwMjg3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/highwaist-jeans"
    },
    {
      name: "Leather Ankle Boots",
      category: "Footwear",
      price: 215,
      image: "https://images.unsplash.com/photo-1570740566605-49bf22d0d79c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmtsZSUyMGJvb3RzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk4NDU0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/ankle-boots-2"
    },
    {
      name: "Cashmere Scarf",
      category: "Accessory",
      price: 95,
      image: "https://images.unsplash.com/photo-1601582589907-f92af5ed9db8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FyZiUyMGZhc2hpb258ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      affiliateLink: "https://example-affiliate.com/cashmere-scarf"
    }
  ]
}

const allProducts: Product[] = [
  // Outfits - 8 items
  {
    id: 101,
    name: "Casual Weekend Look",
    price: 245,
    image: "https://images.unsplash.com/photo-1517389274750-a758d503b69e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBvdXRmaXQlMjBiZWlnZXxlbnwxfHx8fDE3NTk5OTY3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Outfits",
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Relaxed beige outfit for effortless weekends.",
    affiliateLink: "https://example-affiliate.com/casual-weekend"
  },
  {
    id: 102,
    name: "Elegant Neutrals",
    price: 395,
    image: "https://images.unsplash.com/photo-1759229874914-c1ffdb3ebd0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwb3V0Zml0JTIwbmV1dHJhbHxlbnwxfHx8fDE3NTk5OTY3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Outfits",
    isNew: true,
    sizes: ["XS", "S", "M", "L"],
    description: "Sophisticated neutral tones for any occasion.",
    affiliateLink: "https://example-affiliate.com/elegant-neutrals"
  },
  {
    id: 103,
    name: "Minimalist White",
    price: 285,
    image: "https://images.unsplash.com/photo-1693901257178-b5fcb8f036a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwb3V0Zml0JTIwd2hpdGV8ZW58MXx8fHwxNzU5OTk2NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Outfits",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Clean white ensemble for modern elegance.",
    affiliateLink: "https://example-affiliate.com/minimalist-white"
  },
  {
    id: 104,
    name: "Cozy Comfort Set",
    price: 325,
    image: "https://images.unsplash.com/photo-1612044477398-4c48d3bd4197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwb3V0Zml0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk5OTY3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Outfits",
    isNew: true,
    sizes: ["XS", "S", "M", "L"],
    description: "Warm, cozy pieces for relaxed style.",
    affiliateLink: "https://example-affiliate.com/cozy-comfort"
  },
  {
    id: 105,
    name: "Professional Power",
    price: 445,
    image: "https://images.unsplash.com/photo-1753162658653-d33c53910d9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvdXRmaXQlMjB3b21lbnxlbnwxfHx8fDE3NTk5OTY3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Outfits",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Tailored ensemble for the workplace.",
    affiliateLink: "https://example-affiliate.com/professional-power"
  },
  {
    id: 106,
    name: "Street Style Edge",
    price: 365,
    image: "https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBzdHlsZSUyMG91dGZpdHxlbnwxfHx8fDE3NTk5MjM2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Outfits",
    isNew: true,
    sizes: ["XS", "S", "M", "L"],
    description: "Urban-inspired look with modern flair.",
    affiliateLink: "https://example-affiliate.com/street-style"
  },
  {
    id: 107,
    name: "Summer Breeze",
    price: 215,
    image: "https://images.unsplash.com/photo-1599102581515-25a443a08fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBvdXRmaXQlMjBuZXV0cmFsfGVufDF8fHx8MTc1OTk5NjczNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Outfits",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Light, airy pieces for warm days.",
    affiliateLink: "https://example-affiliate.com/summer-breeze"
  },
  {
    id: 108,
    name: "Autumn Layers",
    price: 385,
    image: "https://images.unsplash.com/photo-1666513241353-14a198830381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBvdXRmaXQlMjBsYXllcnN8ZW58MXx8fHwxNzU5OTk2NzM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Outfits",
    isNew: true,
    sizes: ["XS", "S", "M", "L"],
    description: "Layered look perfect for transitional weather.",
    affiliateLink: "https://example-affiliate.com/autumn-layers"
  },

  // Tops - 8 items
  {
    id: 1,
    name: "Essential Knit Sweater",
    price: 89,
    image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2xvdGhpbmclMjBmYXNoaW9ufGVufDF8fHx8MTc1OTg0NTU3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tops",
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Soft, versatile knit perfect for any season.",
    affiliateLink: "https://example-affiliate.com/knit-sweater"
  },
  {
    id: 4,
    name: "Silk Blouse",
    price: 89,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1694232426671-56fcc32bf5b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjB3aGl0ZSUyMGNsb3RoaW5nfGVufDF8fHx8MTc1OTkwMjg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tops",
    isSale: true,
    sizes: ["XS", "S", "M", "L"],
    description: "Luxurious silk blouse for effortless elegance.",
    affiliateLink: "https://example-affiliate.com/silk-blouse"
  },
  {
    id: 7,
    name: "Cashmere Turtleneck",
    price: 165,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN3ZWF0ZXIlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTg0NTU3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tops",
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Luxurious cashmere for ultimate comfort.",
    affiliateLink: "https://example-affiliate.com/cashmere-turtleneck"
  },
  {
    id: 8,
    name: "Linen Button-Up",
    price: 78,
    image: "https://images.unsplash.com/photo-1618333314351-20b0d2d37948?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoaXJ0JTIwd29tZW58ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tops",
    sizes: ["XS", "S", "M", "L"],
    description: "Breathable linen for effortless style.",
    affiliateLink: "https://example-affiliate.com/linen-button-up"
  },
  {
    id: 9,
    name: "Ribbed Tank Top",
    price: 45,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRhbmslMjB0b3B8ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Essential ribbed tank in soft cotton.",
    affiliateLink: "https://example-affiliate.com/ribbed-tank"
  },
  {
    id: 10,
    name: "Oversized Hoodie",
    price: 95,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTkwMjg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Cozy oversized fit for casual comfort.",
    affiliateLink: "https://example-affiliate.com/oversized-hoodie"
  },
  {
    id: 11,
    name: "Merino Wool Cardigan",
    price: 135,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaWdhbiUyMGZhc2hpb258ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tops",
    sizes: ["XS", "S", "M", "L"],
    description: "Classic cardigan in fine merino wool.",
    affiliateLink: "https://example-affiliate.com/wool-cardigan"
  },
  {
    id: 12,
    name: "Striped Breton Top",
    price: 68,
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJpcGVkJTIwc2hpcnQlMjB3b21lbnxlbnwxfHx8fDE3NTk5MDI4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Timeless striped design for everyday wear.",
    affiliateLink: "https://example-affiliate.com/breton-top"
  },

  // Bottoms - 8 items
  {
    id: 2,
    name: "Relaxed Denim Jeans",
    price: 125,
    image: "https://images.unsplash.com/photo-1612636676503-77f496c96ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBjbG90aGluZyUyMGJlaWdlfGVufDF8fHx8MTc1OTkwMjg3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bottoms",
    sizes: ["24", "26", "28", "30", "32"],
    description: "Comfortable, timeless denim with a relaxed fit.",
    affiliateLink: "https://example-affiliate.com/denim-jeans"
  },
  {
    id: 5,
    name: "Wide Leg Trousers",
    price: 145,
    image: "https://images.unsplash.com/photo-1758532758701-49b79820ba3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBvdXRmaXQlMjBjYXN1YWx8ZW58MXx8fHwxNzU5OTAyODgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bottoms",
    isNew: true,
    sizes: ["24", "26", "28", "30", "32"],
    description: "Flowing, sophisticated trousers for modern style.",
    affiliateLink: "https://example-affiliate.com/wide-leg-trousers"
  },
  {
    id: 13,
    name: "High-Waist Culottes",
    price: 98,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHBhbnRzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk5MDI4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bottoms",
    sizes: ["24", "26", "28", "30", "32"],
    description: "Chic culottes with flattering high waist.",
    affiliateLink: "https://example-affiliate.com/culottes"
  },
  {
    id: 14,
    name: "Tailored Midi Skirt",
    price: 115,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN3ZWF0ZXIlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTg0NTU3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bottoms",
    sizes: ["XS", "S", "M", "L"],
    description: "Elegant midi skirt for versatile styling.",
    affiliateLink: "https://example-affiliate.com/midi-skirt"
  },
  {
    id: 15,
    name: "Cargo Pants",
    price: 108,
    image: "https://images.unsplash.com/photo-1548126032-079166fba3e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHBhbnRzJTIwd29tZW58ZW58MXx8fHwxNzU5OTAyODc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bottoms",
    isNew: true,
    sizes: ["24", "26", "28", "30", "32"],
    description: "Functional cargo style with modern fit.",
    affiliateLink: "https://example-affiliate.com/cargo-pants"
  },
  {
    id: 16,
    name: "Pleated Trousers",
    price: 132,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHBhbnRzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk5MDI4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bottoms",
    sizes: ["24", "26", "28", "30", "32"],
    description: "Refined pleated design for polished looks.",
    affiliateLink: "https://example-affiliate.com/pleated-trousers"
  },
  {
    id: 17,
    name: "Linen Shorts",
    price: 72,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9ydHMlMjB3b21lbnxlbnwxfHx8fDE3NTk5MDI4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bottoms",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Breezy linen shorts for warm days.",
    affiliateLink: "https://example-affiliate.com/linen-shorts"
  },
  {
    id: 18,
    name: "Classic Black Trousers",
    price: 118,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHBhbnRzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk5MDI4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bottoms",
    sizes: ["24", "26", "28", "30", "32"],
    description: "Essential black trousers for any occasion.",
    affiliateLink: "https://example-affiliate.com/black-trousers"
  },

  // Accessories - 8 items
  {
    id: 3,
    name: "Statement Necklace",
    price: 65,
    image: "https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBqZXdlbHJ5fGVufDF8fHx8MTc1OTg1MDk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    sizes: ["One Size"],
    description: "Bold, elegant piece to elevate any outfit.",
    affiliateLink: "https://example-affiliate.com/statement-necklace"
  },
  {
    id: 6,
    name: "Leather Crossbody Bag",
    price: 185,
    originalPrice: 220,
    image: "https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBqZXdlbHJ5fGVufDF8fHx8MTc1OTg1MDk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    isSale: true,
    sizes: ["One Size"],
    description: "Premium leather bag for everyday sophistication.",
    affiliateLink: "https://example-affiliate.com/leather-bag"
  },
  {
    id: 19,
    name: "Cashmere Scarf",
    price: 95,
    image: "https://images.unsplash.com/photo-1601582589907-f92af5ed9db8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FyZiUyMGZhc2hpb258ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    isNew: true,
    sizes: ["One Size"],
    description: "Soft cashmere scarf for warmth and style.",
    affiliateLink: "https://example-affiliate.com/cashmere-scarf"
  },
  {
    id: 20,
    name: "Gold Hoop Earrings",
    price: 48,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJyaW5ncyUyMGpld2Vscnl8ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    isNew: true,
    sizes: ["One Size"],
    description: "Classic gold hoops for timeless elegance.",
    affiliateLink: "https://example-affiliate.com/gold-hoops"
  },
  {
    id: 21,
    name: "Leather Belt",
    price: 58,
    image: "https://images.unsplash.com/photo-1624222247344-e8f72a507112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWx0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk5MDI4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    sizes: ["S", "M", "L"],
    description: "Premium leather belt with minimalist buckle.",
    affiliateLink: "https://example-affiliate.com/leather-belt"
  },
  {
    id: 22,
    name: "Wide Brim Hat",
    price: 78,
    image: "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXQlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTkwMjg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    isNew: true,
    sizes: ["One Size"],
    description: "Stylish wide brim hat for sun protection.",
    affiliateLink: "https://example-affiliate.com/wide-brim-hat"
  },
  {
    id: 23,
    name: "Silk Hair Scrunchie Set",
    price: 32,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    sizes: ["One Size"],
    description: "Set of 3 luxe silk scrunchies.",
    affiliateLink: "https://example-affiliate.com/silk-scrunchies"
  },
  {
    id: 24,
    name: "Minimalist Watch",
    price: 195,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMGZhc2hpb258ZW58MXx8fHwxNzU5OTAyODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    isNew: true,
    sizes: ["One Size"],
    description: "Clean, modern watch with leather strap.",
    affiliateLink: "https://example-affiliate.com/minimalist-watch"
  },

  // Jackets (Outerwear) - 8 items
  {
    id: 25,
    name: "Wool Coat",
    price: 285,
    image: "https://images.unsplash.com/photo-1721746033898-570230f0b1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHdpbnRlciUyMGNvYXR8ZW58MXx8fHwxNzU5OTA3NTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Jackets",
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Elegant wool coat for timeless warmth.",
    affiliateLink: "https://example-affiliate.com/wool-coat"
  },
  {
    id: 26,
    name: "Classic Trench Coat",
    price: 325,
    image: "https://images.unsplash.com/photo-1734057491918-0d51f2383712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuY2glMjBjb2F0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk5MjU3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Jackets",
    sizes: ["XS", "S", "M", "L"],
    description: "Timeless trench for sophisticated style.",
    affiliateLink: "https://example-affiliate.com/trench-coat"
  },
  {
    id: 27,
    name: "Denim Jacket",
    price: 98,
    image: "https://images.unsplash.com/photo-1630417250655-a2e072d77ea5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGphY2tldCUyMHdvbWVufGVufDF8fHx8MTc1OTkyNTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Jackets",
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Classic denim jacket for casual days.",
    affiliateLink: "https://example-affiliate.com/denim-jacket"
  },
  {
    id: 28,
    name: "Leather Moto Jacket",
    price: 395,
    image: "https://images.unsplash.com/photo-1711477270962-5bd8fd212540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwamFja2V0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk4ODU5ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Jackets",
    sizes: ["XS", "S", "M", "L"],
    description: "Premium leather for edgy sophistication.",
    affiliateLink: "https://example-affiliate.com/leather-jacket"
  },
  {
    id: 29,
    name: "Tailored Blazer",
    price: 215,
    image: "https://images.unsplash.com/flagged/photo-1553802922-5f7e9934e328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGF6ZXIlMjB3b21lbiUyMGZhc2hpb258ZW58MXx8fHwxNzU5OTI1NzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Jackets",
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Perfectly tailored blazer for polished looks.",
    affiliateLink: "https://example-affiliate.com/blazer"
  },
  {
    id: 30,
    name: "Puffer Jacket",
    price: 185,
    image: "https://images.unsplash.com/photo-1721746930135-f9401608be2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWZmZXIlMjBqYWNrZXQlMjB3b21lbnxlbnwxfHx8fDE3NTk5MjU3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Jackets",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Cozy puffer for cold weather comfort.",
    affiliateLink: "https://example-affiliate.com/puffer-jacket"
  },
  {
    id: 31,
    name: "Bomber Jacket",
    price: 165,
    image: "https://images.unsplash.com/photo-1759333247946-3875ef531633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib21iZXIlMjBqYWNrZXQlMjBzdHlsZXxlbnwxfHx8fDE3NTk4ODU5ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Jackets",
    sizes: ["XS", "S", "M", "L"],
    description: "Sporty bomber with contemporary edge.",
    affiliateLink: "https://example-affiliate.com/bomber-jacket"
  },
  {
    id: 32,
    name: "Waterproof Raincoat",
    price: 145,
    image: "https://images.unsplash.com/photo-1601265722632-f2adfaf8f393?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluY29hdCUyMHdvbWVuJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk5MjU3NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Jackets",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Stylish protection from the elements.",
    affiliateLink: "https://example-affiliate.com/raincoat"
  },

  // Shoes (Footwear) - 8 items
  {
    id: 33,
    name: "White Leather Sneakers",
    price: 125,
    image: "https://images.unsplash.com/photo-1651573091103-530884aa68ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwd29tZW58ZW58MXx8fHwxNzU5ODQwNzA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Shoes",
    isNew: true,
    sizes: ["6", "7", "8", "9", "10"],
    description: "Classic white sneakers for everyday wear.",
    affiliateLink: "https://example-affiliate.com/white-sneakers"
  },
  {
    id: 34,
    name: "Leather Ankle Boots",
    price: 215,
    image: "https://images.unsplash.com/photo-1570740566605-49bf22d0d79c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmtsZSUyMGJvb3RzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk4NDU0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Shoes",
    isNew: true,
    sizes: ["6", "7", "8", "9", "10"],
    description: "Versatile ankle boots for any season.",
    affiliateLink: "https://example-affiliate.com/ankle-boots"
  },
  {
    id: 35,
    name: "Suede Loafers",
    price: 168,
    image: "https://images.unsplash.com/photo-1732708874631-d14fbbe406c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2FmZXJzJTIwd29tZW4lMjBzaG9lc3xlbnwxfHx8fDE3NTk4NDA3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    description: "Sophisticated suede loafers for effortless style.",
    affiliateLink: "https://example-affiliate.com/loafers"
  },
  {
    id: 36,
    name: "Strappy Sandals",
    price: 98,
    image: "https://images.unsplash.com/photo-1584473457417-bd0afe798ae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kYWxzJTIwZmFzaGlvbiUyMHdvbWVufGVufDF8fHx8MTc1OTkyNTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    description: "Elegant sandals for warm weather.",
    affiliateLink: "https://example-affiliate.com/sandals"
  },
  {
    id: 37,
    name: "Block Heel Pumps",
    price: 145,
    image: "https://images.unsplash.com/photo-1554062614-6da4fa67725a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWVscyUyMHNob2VzJTIwZWxlZ2FudHxlbnwxfHx8fDE3NTk5MjU3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Shoes",
    isNew: true,
    sizes: ["6", "7", "8", "9", "10"],
    description: "Comfortable heels with modern block design.",
    affiliateLink: "https://example-affiliate.com/block-heels"
  },
  {
    id: 38,
    name: "Ballet Flats",
    price: 88,
    image: "https://images.unsplash.com/photo-1758542988664-49951c5b1999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsZXQlMjBmbGF0cyUyMHNob2VzfGVufDF8fHx8MTc1OTg0MDcwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    description: "Timeless ballet flats for everyday comfort.",
    affiliateLink: "https://example-affiliate.com/ballet-flats"
  },
  {
    id: 39,
    name: "Running Sneakers",
    price: 135,
    image: "https://images.unsplash.com/photo-1602593330926-30c90a271fa5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjB3b21lbnxlbnwxfHx8fDE3NTk5MjU3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    description: "Performance sneakers for active lifestyle.",
    affiliateLink: "https://example-affiliate.com/running-sneakers"
  },
  {
    id: 40,
    name: "Canvas Espadrilles",
    price: 78,
    image: "https://images.unsplash.com/photo-1559504344-33abd17324d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BhZHJpbGxlcyUyMGZhc2hpb24lMjBzaG9lc3xlbnwxfHx8fDE3NTk5MjU3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Shoes",
    isNew: true,
    sizes: ["6", "7", "8", "9", "10"],
    description: "Casual espadrilles for relaxed summer style.",
    affiliateLink: "https://example-affiliate.com/espadrilles"
  }
];

export function ProductCatalog({ activeCategory }: ProductCatalogProps) {
  const [sortBy, setSortBy] = useState<string>("newest");

  const filteredProducts = allProducts.filter(product => {
    if (activeCategory === "New") return product.isNew;
    if (activeCategory === "all") return true;
    return product.category === activeCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleShopNow = (product: Product) => {
    // If it's an outfit, navigate to outfit detail page
    if (product.category === "Outfits") {
      window.dispatchEvent(new CustomEvent('navigate-outfit', { detail: product.id }));
    } else {
      // Otherwise open affiliate link in new tab
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0 border border-gray-200 p-4 rounded-lg">
          <div>
            <h2 className="text-3xl tracking-wide text-gray-900">
              {activeCategory === "all" ? "Others" : activeCategory}
            </h2>
            <p className="text-gray-600 mt-2">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="group">
              <div 
                className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-stone-50 cursor-pointer"
                onClick={() => handleShopNow(product)}
              >
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-2">
                  {product.isNew && (
                    <Badge variant="secondary" className="bg-white text-gray-900">
                      New
                    </Badge>
                  )}
                  {product.isSale && (
                    <Badge variant="destructive" className="bg-red-600 text-white">
                      Sale
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg text-gray-900 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleShopNow(product)}
                    className="w-full bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                  >
                    {product.category === "Outfits" ? "View Outfit Details" : "Shop Now"}
                    {product.category === "Outfits" ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}