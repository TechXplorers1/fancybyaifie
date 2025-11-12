
'use client';

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
            <Link href="/privacy" className="hover:underline uppercase">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="hover:underline uppercase">
              Disclaimer
            </Link>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <div className="text-center opacity-80 italic cursor-pointer hover:underline">
                This Page Contains Affiliate Links
              </div>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[425px] rounded-lg">
              <DialogHeader>
                <DialogTitle>Affiliate Disclosure</DialogTitle>
                <DialogDescription>
                  This disclosure details the affiliate relationships of Fancy by Aifie.
                </DialogDescription>
              </DialogHeader>
              <div className="text-sm text-muted-foreground space-y-4 py-4">
                <p>Fancy by Aifie participates in affiliate marketing programs, which means I may earn a small commission when you click on links or make purchases through the links on this website — at no additional cost to you.</p>
                <p>I only share products, brands, or services that I genuinely love, recommend, or personally use. These commissions help support this site and allow me to continue creating content, style guides, beauty inspiration, and lifestyle resources for you.</p>
                <p>Thank you for supporting my work!</p>
              </div>
            </DialogContent>
          </Dialog>

          <div className="text-right opacity-80">
             <a href="https://techxplorers.in/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Developed by Techxplorers pvt ltd
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
