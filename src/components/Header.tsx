
'use client';

import { useState } from 'react';
import { Search, Menu, Instagram, Facebook, ShoppingBag, Sun, Moon, Youtube } from 'lucide-react';
import { Button } from './ui/button';
import { PinterestIcon, TikTokIcon } from './icons';
import { useTheme } from '@/context/ThemeProvider';
import { Product } from '@/lib/products';
import Link from 'next/link';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  onNavigate: (category: string) => void;
  onProductSelect: (product: Product) => void;
  products: Product[];
}

export function Header({ onNavigate, onProductSelect, products }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const socialLinks = [
    { name: 'Outfits', icon: ShoppingBag, url: '/outfits', isInternal: true },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/fancy_byaifie' },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/fancybyaifie' },
    { name: 'TikTok', icon: TikTokIcon, url: 'tiktok.com/@fancy_byaifie' },
    { name: 'Pinterest', icon: PinterestIcon, url: 'https://pinterest.com/fancybyaifie' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@fancybyaifie' }

  ];

  return (
    <>
      <header className="w-full bg-accent dark:bg-accent/90 backdrop-blur-lg border-b border-gray-100 dark:border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Open menu"
                className="text-accent-foreground hover:bg-accent/80"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">
              <button 
                onClick={() => onNavigate('home')}
                className="text-2xl font-headline tracking-wider text-accent-foreground hover:opacity-80 transition-opacity"
              >
                fancybyaifie
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                if (social.isInternal) {
                  return (
                    <Link
                      key={social.name}
                      href={social.url}
                      aria-label={social.name}
                      className="flex flex-col items-center gap-1 text-accent-foreground/80 hover:text-accent-foreground transition-colors group"
                    >
                      <Icon className="h-7 w-7" />
                      <span className="text-xs font-medium">{social.name}</span>
                    </Link>
                  );
                }

                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-accent-foreground/80 hover:text-accent-foreground transition-colors group"
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
                className="text-accent-foreground hover:bg-accent/80"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="text-accent-foreground hover:bg-accent/80"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-accent-foreground/20 py-4">
              <nav className="flex justify-center space-x-4 sm:space-x-6 px-2 sm:px-4 overflow-x-auto">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  if (social.isInternal) {
                    return (
                       <Link
                        key={social.name}
                        href={social.url}
                        aria-label={social.name}
                        className="flex flex-col items-center gap-1.5 text-accent-foreground/80 hover:text-accent-foreground transition-colors flex-shrink-0"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-7 w-7"/>
                        <span className="text-xs font-medium">{social.name}</span>
                      </Link>
                    )
                  }

                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 text-accent-foreground/80 hover:text-accent-foreground transition-colors flex-shrink-0"
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
        products={products}
        onProductSelect={onProductSelect}
      />
    </>
  );
}
