import amazonFindsImage from 'figma:asset/08e7c11dc237bd1fabe4d1e2e5c816b87605c294.png';

export function AmazonFindsSection() {
  const handleStorefrontClick = () => {
    window.open('https://amazon.com', '_blank');
  };

  return (
    <section className="bg-stone-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <img 
            src={amazonFindsImage} 
            alt="Recent Amazon Finds" 
            className="w-full max-w-5xl cursor-pointer hover:opacity-95 transition-opacity"
            onClick={handleStorefrontClick}
          />
        </div>
      </div>
    </section>
  );
}
