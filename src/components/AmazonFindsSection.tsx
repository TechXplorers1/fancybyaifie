import { ImageWithFallback } from './figma/ImageWithFallback';

const amazonFinds = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYwNDUyMzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Fashion Accessories'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbnMlMjBjbG90aGluZ3xlbnwxfHx8fDE3NjA1MjUzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Womens Clothing'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwaGFuZGJhZ3xlbnwxfHx8fDE3NjA1MTc3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Leather Handbag'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1718967807877-f2e04ffc7343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwc3R5bGV8ZW58MXx8fHwxNzYwNTExMzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Sunglasses Style'
  }
];

export function AmazonFindsSection() {
  const handleStorefrontClick = () => {
    window.open('https://amazon.com', '_blank');
  };

  return (
    <section className="bg-stone-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <h2 className="mb-8 px-8 py-3 bg-stone-800 text-white rounded-lg font-bold">Recent Amazon Finds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            {amazonFinds.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                onClick={handleStorefrontClick}
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
