import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface SiteData {
  heroImage: string;
  worksImages: string[];
  blockedSlots: { id: string; date: string; slot_id: string | null }[];
  refreshData: () => Promise<void>;
}

const defaultHero = 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=2772&auto=format&fit=crop';
const defaultWorks = [
  'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=2787&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=2787&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2874&auto=format&fit=crop'
];

const DataContext = createContext<SiteData>({
  heroImage: defaultHero,
  worksImages: defaultWorks,
  blockedSlots: [],
  refreshData: async () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [heroImage, setHeroImage] = useState(defaultHero);
  const [worksImages, setWorksImages] = useState(defaultWorks);
  const [blockedSlots, setBlockedSlots] = useState<any[]>([]);

  const refreshData = async () => {
    if (!supabase) return;
    
    // Fetch images
    const { data: imgData } = await supabase.from('site_images').select('*');
    if (imgData) {
      const hero = imgData.find((img: any) => img.section_id === 'hero');
      if (hero && hero.urls && hero.urls.length > 0) setHeroImage(hero.urls[0]);
      
      const works = imgData.find((img: any) => img.section_id === 'works');
      if (works && works.urls && works.urls.length > 0) setWorksImages(works.urls);
    }

    // Fetch blocks
    const { data: blockData } = await supabase.from('blocked_slots').select('*');
    if (blockData) {
      setBlockedSlots(blockData);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{ heroImage, worksImages, blockedSlots, refreshData }}>
      {children}
    </DataContext.Provider>
  );
}

export const useSiteData = () => useContext(DataContext);
