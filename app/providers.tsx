'use client';

import { useEffect, useState } from 'react';
import { useBoardStore } from '@/store/useBoardStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const loadFromStorage = useBoardStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
    setIsHydrated(true);
  }, [loadFromStorage]);

  if (!isHydrated) {
    return (
      <div className="h-screen w-screen bg-[#F8F9FA] flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-lg animate-pulse"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)' }}
        />
      </div>
    );
  }

  return <>{children}</>;
}