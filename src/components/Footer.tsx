import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  const handleAdminClick = () => {
    // Dispatch custom event to show admin
    const event = new CustomEvent('show-admin');
    window.dispatchEvent(event);
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-3">
          <div>
            <button 
              onClick={handleAdminClick}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Admin
            </button>
          </div>
          <p className="text-sm text-gray-600">
            © 2025 Fancybyaifie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}