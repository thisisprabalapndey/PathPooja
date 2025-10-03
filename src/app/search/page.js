import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sacred search...</p>
          </div>
        </div>
      }>
        <SearchPageClient />
      </Suspense>
    </div>
  );
}
