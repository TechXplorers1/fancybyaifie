import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Shop My Outfit",
    image: "https://images.unsplash.com/photo-1686628101951-ce2bd65ab579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wbGV0ZSUyMG91dGZpdCUyMHN0eWxlZCUyMGZhc2hpb258ZW58MXx8fHwxNzU5OTk2NzI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Outfits"
  },
  {
    id: 2,
    name: "Essential Knit",
    image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2xvdGhpbmclMjBmYXNoaW9ufGVufDF8fHx8MTc1OTg0NTU3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Tops"
  },
  {
    id: 3,
    name: "Relaxed Denim",
    image: "https://images.unsplash.com/photo-1612636676503-77f496c96ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBjbG90aGluZyUyMGJlaWdlfGVufDF8fHx8MTc1OTkwMjg3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Bottoms"
  },
  {
    id: 4,
    name: "Statement Accessories",
    image: "https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBqZXdlbHJ5fGVufDF8fHx8MTc1OTg1MDk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories"
  },
  {
    id: 5,
    name: "Outerwear",
    image: "https://images.unsplash.com/photo-1637258966887-9d23cbbcecd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBvdXRlcndlYXIlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTkxOTg0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Jackets"
  },
  {
    id: 6,
    name: "Footwear",
    image: "https://images.unsplash.com/photo-1722005924485-40c91abb67f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZm9vdHdlYXIlMjBzaG9lc3xlbnwxfHx8fDE3NTk5MTk4NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Shoes"
  }
];

export function ProductShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">

          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover pieces that embody freedom of expression and timeless elegance
          </p>
        </div>

        {/* Product grid */}
        <div className="grid md:grid-cols-6 gap-8 mb-16">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer"
                 onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: product.category }))}>
              <div className="aspect-square rounded-full overflow-hidden mb-6 bg-stone-50">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <h4 className="text-lg text-gray-900 mb-1">{product.name}</h4>
                <p className="text-gray-500 text-sm">{product.category}</p>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}