
'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export function Footer() {
  const dispatchAdminEvent = () => {
    window.dispatchEvent(new CustomEvent('admin-access-trigger'));
  };

  return (
    <footer className="bg-accent dark:bg-accent/90 text-accent-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <div className="flex gap-4">
            <div onClick={dispatchAdminEvent} className="cursor-pointer" style={{ width: '1px', height: '1px', opacity: 0 }}>
                Admin Access
            </div>
            <Link href="/terms" className="hover:underline uppercase">
              Terms + Conditions
            </Link>
            <Link href="/about" className="hover:underline uppercase">
              ABOUT FANCYBYAIFIE
            </Link>
          </div>
          <div className="text-center opacity-80 italic">
            This Page Contains Affiliate Links
          </div>
          <div className="text-right opacity-80">
             <a href="https://techxplorers.in/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Development by Techxplorers pvt ltd
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
