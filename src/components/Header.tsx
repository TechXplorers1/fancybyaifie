import { useState } from 'react';
import { Search, Menu, Instagram, Facebook, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  onNavigate: (category: string) => void;
}

// Amazon SVG Icon Component
const AmazonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.9 17.3c-2.9 2.1-7.1 3.3-10.7 3.3-5.1 0-9.6-1.9-13.1-5 -0.3-0.2-0.1-0.5 0.2-0.4 4.8 2.8 10.7 4.5 16.9 4.5 4.1 0 8.7-0.9 12.9-2.7 0.6-0.3 1.1 0.4 0.5 0.8L14.9 17.3z" fill="currentColor"/>
    <path d="M16.7 15.2c-0.4-0.5-2.4-0.2-3.3-0.1-0.3 0-0.3-0.2-0.1-0.4 1.6-1.1 4.3-0.8 4.6-0.4 0.3 0.4-0.1 3.1-1.6 4.4-0.2 0.2-0.5 0.1-0.4-0.2C16.2 17.6 17 15.7 16.7 15.2z" fill="currentColor"/>
    <path d="M15 2v-1.5c0-0.2 0.2-0.4 0.4-0.4h6.3c0.2 0 0.4 0.2 0.4 0.4V2c0 0.2-0.2 0.5-0.4 0.7l-3.3 4.7c1.2 0 2.5 0.2 3.6 0.9 0.2 0.2 0.3 0.4 0.3 0.6v1.6c0 0.2-0.3 0.5-0.5 0.3-1.6-0.8-3.6-0.9-5.3 0-0.2 0.1-0.5-0.1-0.5-0.3V9c0-0.3 0-0.7 0.3-1.1l3.8-5.4h-3.3C15.2 2.4 15 2.2 15 2z" fill="currentColor"/>
  </svg>
);

// Pinterest SVG Icon Component  
const PinterestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.545 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="currentColor"/>
  </svg>
);

export function Header({ onNavigate }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const socialLinks = [
    { name: 'Shop', icon: ShoppingBag, url: 'https://example.com' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com' },
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com' },
    { name: 'Pinterest', icon: PinterestIcon, url: 'https://pinterest.com' }
  ];

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => onNavigate('home')}
                className="text-2xl tracking-wider text-gray-900 hover:text-gray-600 transition-colors"
              >
                Fancybyaifie
              </button>
            </div>

            {/* Social Media Icons - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors group"
                    aria-label={social.name}
                  >
                    <Icon className="h-7 w-7" />
                    <span className="text-xs">{social.name}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Social Media */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <nav className="flex justify-center space-x-8 px-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
                      aria-label={social.name}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-7 w-7" />
                      <span className="text-xs">{social.name}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}