
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import imageData from '@/lib/placeholder-images.json';
import { Badge } from './ui/badge';

const { placeholderImages: blogImages } = imageData;

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image?: {
      id: string;
      description: string;
      imageUrl: string;
      imageHint: string;
  };
  slug: string;
  content: string;
  isNew?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '5 Ways to Style a Classic White Tee',
    excerpt: 'The classic white tee is a wardrobe staple for a reason. It\'s versatile, comfortable, and can be dressed up or down. Here are five creative ways to style yours...',
    image: blogImages.find(p => p.id === 'blog-1'),
    slug: 'style-white-tee',
    content: `
      <p>The classic white tee is a wardrobe staple for a reason. It's versatile, comfortable, and can be dressed up or down. But are you getting the most out of this timeless piece? We think there's always a new way to wear an old favorite. Here are five creative ways to style yours, taking it from a simple basic to the star of your outfit.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">1. The Polished Professional</h3>
      <p>Tuck your white tee into a pair of high-waisted tailored trousers. Add a classic blazer and a pair of pointed-toe flats or heels. This look is effortlessly chic and perfect for a business-casual office or a sophisticated lunch meeting. The simplicity of the tee balances the structure of the blazer, creating a look that’s both polished and approachable.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">2. The Weekend Casual</h3>
      <p>For a relaxed weekend vibe, pair your tee with your favorite denim jeans—be it straight-leg, skinny, or boyfriend style. Loosely tuck the front of the shirt into your jeans and add a pair of stylish sneakers. To elevate the look, throw on a leather jacket or a cozy cardigan. It's a go-to formula that never fails.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">3. The Feminine Flair</h3>
      <p>Juxtapose the simplicity of the white tee by pairing it with a flowing midi or maxi skirt. Whether it's a bold floral print, a sleek satin slip, or a pleated A-line, the tee acts as a perfect, neutral canvas. Knot the tee at your waist to define your silhouette and complete the look with sandals or espadrilles.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">4. The Edgy Statement</h3>
      <p>Layer your white tee under a slip dress for a '90s-inspired look that feels modern and cool. This is a great way to get more wear out of your favorite slip dresses year-round. Finish the outfit with combat boots or chunky sneakers to lean into the edgy aesthetic.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">5. The Monochromatic Moment</h3>
      <p>Create a clean, minimalist look by pairing your white tee with white or cream-colored jeans or trousers. The key to a successful monochromatic outfit is to play with different textures. Combine a cotton tee with denim, linen, or silk bottoms to add depth and interest. Accessorize with metallic or neutral-toned pieces to keep it cohesive.</p>
    `,
    isNew: true,
  },
  {
    id: 2,
    title: 'Building a Capsule Wardrobe for the Season',
    excerpt: 'Simplify your life and elevate your style by building a capsule wardrobe. We\'ll guide you through the process of selecting timeless pieces that work together seamlessly.',
    image: blogImages.find(p => p.id === 'blog-2'),
    slug: 'capsule-wardrobe',
    content: `
      <p>A capsule wardrobe is a collection of essential items that don't go out of style, which can then be augmented with seasonal pieces. The goal is to create a wardrobe that is both versatile and functional, allowing you to create a multitude of outfits from a small selection of clothes. It simplifies your mornings, reduces decision fatigue, and promotes a more sustainable approach to fashion.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">Step 1: Define Your Personal Style</h3>
      <p>Before you start curating, take some time to understand your personal style. What do you feel most comfortable in? What colors do you gravitate towards? Create a mood board on Pinterest or save images of outfits you love. Look for recurring themes in silhouettes, colors, and overall vibes.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">Step 2: Choose a Color Palette</h3>
      <p>A successful capsule wardrobe is built on a cohesive color palette. Start with one or two neutral base colors (like black, white, grey, navy, or beige). Then, add one or two accent colors that complement your base colors and make your outfits pop. This ensures that every piece in your wardrobe can be mixed and matched with ease.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">Step 3: Select Your Core Items</h3>
      <p>Your core items are the workhorses of your wardrobe. These are high-quality, timeless pieces that will last for years. A typical capsule wardrobe might include:</p>
      <ul class="list-disc list-inside space-y-2 mt-2">
        <li>A classic trench coat or a wool coat</li>
        <li>A well-fitting pair of dark wash jeans</li>
        <li>Tailored trousers in a neutral color</li>
        <li>A white button-down shirt and a collection of neutral tees</li>
        <li>A versatile sweater (cashmere or merino wool)</li>
        <li>A little black dress or a versatile jumpsuit</li>
        <li>Classic footwear like ankle boots, sneakers, and flats</li>
      </ul>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">Step 4: Accessorize Thoughtfully</h3>
      <p>Accessories are the key to personalizing your capsule wardrobe and making it feel fresh. Invest in a quality handbag, a silk scarf, a classic watch, and some simple jewelry. These small additions can completely transform an outfit.</p>
    `
  },
  {
    id: 3,
    title: 'The Art of Accessorizing: Less is More',
    excerpt: 'Accessories can make or break an outfit. Discover our philosophy on accessorizing, focusing on how a few key pieces can make a powerful statement.',
    image: blogImages.find(p => p.id === 'blog-3'),
    slug: 'art-of-accessorizing',
    content: `
      <p>Coco Chanel famously advised, "Before you leave the house, look in the mirror and take one thing off." This philosophy of "less is more" is at the heart of masterful accessorizing. It's not about how many accessories you wear, but how you wear them. A few well-chosen pieces can elevate an outfit from simple to stunning, while too many can create a cluttered and distracting look.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">Focus on a Focal Point</h3>
      <p>Decide which accessory will be the star of your outfit. Is it a statement necklace, a pair of bold earrings, a vibrant scarf, or a designer handbag? Let that one piece shine and keep the rest of your accessories minimal and complementary. If you're wearing a statement necklace, for example, consider forgoing earrings or choosing a simple stud.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">The Rule of Three</h3>
      <p>A good rule of thumb is to limit your accessories to three main pieces. This could be a necklace, a watch, and a ring; or earrings, a bracelet, and a handbag. This helps to create a balanced and cohesive look without overwhelming your outfit.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">Mix Your Metals</h3>
      <p>The old rule of not mixing gold and silver is outdated. Mixing metals can add a modern and sophisticated touch to your look. The key is to do it intentionally. Try layering a gold chain with a silver one, or wearing a mix of gold and silver rings. The contrast can be surprisingly chic.</p>
      <h3 class="text-xl font-headline text-primary mt-6 mb-2">Consider the Neckline</h3>
      <p>The neckline of your top or dress should guide your choice of necklace. A V-neck is perfect for a pendant necklace that follows the "V" shape. A crew neck or a boat neck pairs well with a shorter statement necklace or a collar necklace. For a turtleneck, opt for a long pendant necklace to elongate your silhouette.</p>
    `
  }
];

interface BlogSectionProps {
  onPostClick: (post: BlogPost) => void;
}

export function BlogSection({ onPostClick }: BlogSectionProps) {
  return (
    <section className="bg-background border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-headline text-accent">From the Blog</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights on style, sustainability, and the stories behind our collections.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
             <button key={post.id} onClick={() => onPostClick(post)} className="block group text-left">
              <Card className="overflow-hidden h-full flex flex-col relative">
                 {post.isNew && (
                  <Badge className="absolute top-2 left-2 z-10 bg-primary/90 text-primary-foreground">
                    Newly Added
                  </Badge>
                )}
                <CardContent className="p-0 flex-grow flex flex-col">
                  <div className="block aspect-[4/3] relative">
                    {post.image && (
                      <Image
                        src={post.image.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={post.image.imageHint}
                      />
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-headline text-primary mb-2 flex-grow group-hover:underline">
                        {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">{post.excerpt}</p>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

    