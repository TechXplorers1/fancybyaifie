
'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const dispatchAdminEvent = () => {
    window.dispatchEvent(new CustomEvent('admin-access-trigger'));
  };

  return (
    <footer className="bg-white border-t border-gray-100 dark:bg-card dark:border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-3">
          <div onClick={dispatchAdminEvent} className="cursor-pointer" style={{ width: '1px', height: '1px', opacity: 0 }}>
              Admin Access
          </div>
          <p className="text-xs text-muted-foreground">This Page Contains Affiliate Links</p>
          <div className="text-sm text-muted-foreground">
            <span>© {currentYear} fancybyaifie. All rights reserved.</span>
            <span className="mx-2">|</span>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
