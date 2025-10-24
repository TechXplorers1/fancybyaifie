
'use client';

import { useState } from 'react';
import { Search, Menu, Instagram, Facebook, ShoppingBag, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { SearchModal } from './SearchModal';
import { PinterestIcon } from './icons';
import { useTheme } from '@/context/ThemeProvider';
import { Product } from '@/lib/products';

interface HeaderProps {
  onNavigate: (category: string) => void;
  onProductSelect: (product: Product) => void;
  products: Product[];
}

export function Header({ onNavigate, onProductSelect, products }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const socialLinks = [
    { name: 'Shop', icon: ShoppingBag, url: 'https://www.amazon.com/fashion' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com' },
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com' },
    { name: 'Pinterest', icon: PinterestIcon, url: 'https://pinterest.com' }
  ];

  return (
    <>
      <header className="w-full bg-white/80 dark:bg-background/80 backdrop-blur-lg border-b border-gray-100 dark:border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">
              <button 
                onClick={() => onNavigate('home')}
                className="text-2xl font-headline tracking-wider text-primary hover:opacity-80 transition-opacity"
              >
                fancybyaifie
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors group"
                    aria-label={social.name}
                  >
                    <Icon className="h-7 w-7" />
                    <span className="text-xs font-medium">{social.name}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 dark:border-border/50 py-4">
              <nav className="flex justify-center space-x-6 px-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                      aria-label={social.name}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-7 w-7"/>
                      <span className="text-xs font-medium">{social.name}</span>
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
        onProductSelect={onProductSelect}
        products={products}
      />
    </>
  );
}
