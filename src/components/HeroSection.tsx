import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import homeImage from '../assets/home.png';

export function HeroSection() {
  return (
    <section className="relative bg-stone-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl tracking-wide text-gray-900 leading-tight">
                Born Out of Free
              </h2>
              <p className="text-lg text-gray-600 max-w-md leading-relaxed">
                Embracing authenticity and individual expression through thoughtfully designed pieces that speak to your unique style.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-outfit', { detail: 103 }))}
                className="bg-gray-900 text-white px-8 py-3 hover:bg-gray-800 transition-colors"
              >
                Shop My Outfit
              </Button>
            </div>
          </div>

          {/* Right side - Model image */}
          <div className="relative">
            <div className="aspect-[3/4] w-full max-w-md mx-auto">
              <ImageWithFallback
                src={homeImage}
                alt="Model in white clothing"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}