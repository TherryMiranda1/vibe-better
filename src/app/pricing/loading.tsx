export default function PricingLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
          <div className="mt-4 h-6 w-96 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="p-6 bg-white">
                <div className="h-7 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="mt-2 h-5 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                
                <div className="mt-4">
                  <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                
                <div className="mt-6">
                  <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="mt-1 h-4 w-36 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 p-6">
                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
