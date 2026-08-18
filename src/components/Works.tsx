import * as motion from 'motion/react-client';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData } from '../context/DataContext';

export default function Works() {
  const { t } = useLanguage();
  const { worksImages } = useSiteData();

  return (
    <section id="works" className="py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 md:flex md:items-end md:justify-between border-b border-black pb-4">
          <div>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic mb-2">
              {t.works.title}
            </h2>
            <p className="text-black/60 text-[10px] font-bold uppercase tracking-[0.4em]">
              {t.works.sub}
            </p>
          </div>
          <a href="#services" className="hidden md:inline-block text-[11px] font-bold uppercase tracking-[0.2em] hover:line-through transition-colors mt-4 md:mt-0">
            {t.works.view}
          </a>
        </div>

        {/* Scrollable Container */}
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            #works .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {worksImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="w-[75vw] sm:w-[280px] md:w-[320px] snap-center shrink-0 border border-black p-2 relative group overflow-hidden cursor-pointer"
            >
              <div className="w-full aspect-[3/4] overflow-hidden bg-neutral-100 relative">
                <img
                  src={src}
                  alt={`Work ${index + 1}`}
                  className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
