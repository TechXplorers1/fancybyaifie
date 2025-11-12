
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DisclaimerPage() {
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
            <h1 className="text-4xl font-headline text-primary">Disclaimer</h1>
            
            <p>All content provided on Fancy by Aifie is for informational and inspirational purposes only. The fashion, beauty, skincare, and lifestyle recommendations shared here reflect personal opinions, experiences, and research, and should not be taken as professional, medical, or expert advice.</p>
            
            <p>Please always perform your own research and use your own judgment before purchasing or applying any product featured or recommended on this site. Results may vary, and Fancy by Aifie is not responsible for any reactions, skin sensitivities, or outcomes from products or recommendations mentioned here.</p>
           
            <p>By using this website, you acknowledge that any reliance on information found here is at your own risk.</p>
            
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
