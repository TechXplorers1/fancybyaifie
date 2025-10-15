import image_540cc77d8f815f2f305a894701670721e4206302 from 'figma:asset/540cc77d8f815f2f305a894701670721e4206302.png';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AmazonFindsSection } from './components/AmazonFindsSection';
import { ProductShowcase } from './components/ProductShowcase';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ProductCatalog } from './components/ProductCatalog';
import { OutfitDetailPage } from './components/OutfitDetailPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { SubscriptionDialog } from './components/SubscriptionDialog';
import { Toaster } from './components/ui/sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
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

// Outfit data from ProductCatalog
const outfitData: Record<number, { name: string; price: number; image: string; description: string; items: OutfitItem[] }> = {
  101: {
    name: "Casual Weekend Look",
    price: 245,
    image: "https://images.unsplash.com/photo-1517389274750-a758d503b69e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBvdXRmaXQlMjBiZWlnZXxlbnwxfHx8fDE3NTk5OTY3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Relaxed beige outfit for effortless weekends.",
    items: [
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
    ]
  },
  102: {
    name: "Elegant Neutrals",
    price: 395,
    image: "https://images.unsplash.com/photo-1759229874914-c1ffdb3ebd0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwb3V0Zml0JTIwbmV1dHJhbHxlbnwxfHx8fDE3NTk5OTY3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Sophisticated neutral tones for any occasion.",
    items: [
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
    ]
  },
  103: {
    name: "Minimalist White",
    price: 285,
    image: image_540cc77d8f815f2f305a894701670721e4206302,
    description: "Clean white ensemble for modern elegance.",
    items: [
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
    ]
  },
  104: {
    name: "Cozy Comfort Set",
    price: 325,
    image: "https://images.unsplash.com/photo-1612044477398-4c48d3bd4197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwb3V0Zml0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk5OTY3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Warm, cozy pieces for relaxed style.",
    items: [
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
    ]
  },
  105: {
    name: "Professional Power",
    price: 445,
    image: "https://images.unsplash.com/photo-1753162658653-d33c53910d9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvdXRmaXQlMjB3b21lbnxlbnwxfHx8fDE3NTk5OTY3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Tailored ensemble for the workplace.",
    items: [
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
    ]
  },
  106: {
    name: "Street Style Edge",
    price: 365,
    image: "https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBzdHlsZSUyMG91dGZpdHxlbnwxfHx8fDE3NTk5MjM2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Urban-inspired look with modern flair.",
    items: [
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
    ]
  },
  107: {
    name: "Summer Breeze",
    price: 215,
    image: "https://images.unsplash.com/photo-1599102581515-25a443a08fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBvdXRmaXQlMjBuZXV0cmFsfGVufDF8fHx8MTc1OTk5NjczNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Light, airy pieces for warm days.",
    items: [
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
    ]
  },
  108: {
    name: "Autumn Layers",
    price: 385,
    image: "https://images.unsplash.com/photo-1666513241353-14a198830381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBvdXRmaXQlMjBsYXllcnN8ZW58MXx8fHwxNzU5OTk2NzM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Layered look perfect for transitional weather.",
    items: [
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
};

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedOutfitId, setSelectedOutfitId] = useState<number | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState<boolean>(false);

  // Show subscription dialog on first visit
  useEffect(() => {
    const hasSeenDialog = sessionStorage.getItem('hasSeenSubscriptionDialog');
    if (!hasSeenDialog) {
      // Show dialog after 2 seconds
      const timer = setTimeout(() => {
        setShowSubscriptionDialog(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseSubscriptionDialog = () => {
    setShowSubscriptionDialog(false);
    sessionStorage.setItem('hasSeenSubscriptionDialog', 'true');
  };

  // Handle navigation events
  useEffect(() => {
    const handleNavigate = (event: CustomEvent<string>) => {
      setCurrentView(event.detail);
      setSelectedOutfitId(null);
    };

    const handleNavigateOutfit = (event: CustomEvent<number>) => {
      setSelectedOutfitId(event.detail);
      setCurrentView('outfit-detail');
    };

    const handleShowAdmin = () => {
      setShowAdminLogin(true);
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    window.addEventListener('navigate-outfit', handleNavigateOutfit as EventListener);
    window.addEventListener('show-admin', handleShowAdmin);
    
    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
      window.removeEventListener('navigate-outfit', handleNavigateOutfit as EventListener);
      window.removeEventListener('show-admin', handleShowAdmin);
    };
  }, []);

  const handleNavigate = (category: string) => {
    if (category === 'all') {
      // Scroll to products section on home page
      setCurrentView('home');
      setTimeout(() => {
        const productsSection = document.getElementById('others-section');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (category === 'New' || category === 'Tops' || category === 'Bottoms' || category === 'Accessories' || category === 'Jackets' || category === 'Shoes' || category === 'Outfits') {
      setCurrentView(category);
    } else {
      setCurrentView('home');
    }
  };

  const renderContent = () => {
    if (currentView === 'outfit-detail' && selectedOutfitId && outfitData[selectedOutfitId]) {
      const outfit = outfitData[selectedOutfitId];
      return (
        <OutfitDetailPage
          outfitName={outfit.name}
          outfitImage={outfit.image}
          outfitDescription={outfit.description}
          totalPrice={outfit.price}
          items={outfit.items}
          onBack={() => {
            setCurrentView('Outfits');
            setSelectedOutfitId(null);
          }}
        />
      );
    } else if (currentView === 'home') {
      return (
        <>
          <HeroSection />
          <AmazonFindsSection />
          <ProductShowcase />
          <div id="others-section">
            <ProductCatalog activeCategory="all" />
          </div>
          <NewsletterSection />
        </>
      );
    } else {
      return (
        <ProductCatalog 
          activeCategory={currentView}
        />
      );
    }
  };

  // Handle admin access
  if (showAdminLogin && !isAdminLoggedIn) {
    return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;
  }

  if (showAdminLogin && isAdminLoggedIn) {
    return (
      <AdminDashboard 
        onLogout={() => {
          setIsAdminLoggedIn(false);
          setShowAdminLogin(false);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigate={handleNavigate}
      />
      <main>
        {renderContent()}
        {currentView !== 'home' && currentView !== 'outfit-detail' && <NewsletterSection />}
      </main>
      <Footer />
      <SubscriptionDialog 
        open={showSubscriptionDialog} 
        onClose={handleCloseSubscriptionDialog}
      />
      <Toaster />
    </div>
  );
}