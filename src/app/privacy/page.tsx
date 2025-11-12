
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header onNavigate={handleNavigate} onProductSelect={() => {}} products={[]} />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="text-4xl font-headline text-primary">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <p>Your privacy is important to me. This Privacy Policy explains how Fancy by Aifie (“we,” “I,” or “the site”) collects, uses, and protects your personal information when you visit or interact with this website.</p>
            
            <h2>Information We Collect</h2>
            <p>We may collect personal information such as:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Name and email address (if you subscribe or contact me)</li>
              <li>Data from cookies and similar technologies</li>
              <li>Website usage data, including pages viewed, time spent on site, and general traffic analytics</li>
            </ul>
            <p>This information helps improve the website, create better content, and enhance your browsing experience.</p>
            
            <h2>How Your Information Is Used</h2>
            <p>We may use your information to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Send newsletters or updates (only if you opt in)</li>
              <li>Improve website content, layout, and performance</li>
              <li>Respond to inquiries or messages</li>
              <li>Track analytics for better user experience</li>
            </ul>
            <p>Your information is never sold to third parties.</p>
            
            <h2>Third-Party Links & Affiliates</h2>
            <p>This website may include links to third-party websites or affiliate partners. These external sites have their own privacy policies, and Fancy by Aifie is not responsible for their practices or content.</p>
            
            <h2>Cookies</h2>
            <p>Cookies help personalize your experience and track website performance. You can disable cookies at any time through your browser settings.</p>
            
            <h2>Your Rights</h2>
            <p>You may request to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Access or update your personal information</li>
              <li>Unsubscribe from emails at any time</li>
              <li>Request deletion of your data</li>
            </ul>
            <p>To make a request, contact me through the website.</p>
            
            <h2>Consent</h2>
            <p>By using this website, you consent to the terms outlined in this Privacy Policy.</p>
            
            <h2>Updates</h2>
            <p>This Privacy Policy may be updated from time to time. Changes will be posted on this page with an updated date.</p>

            <Button asChild className="mt-8">
                <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
