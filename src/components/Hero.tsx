import * as motion from 'motion/react-client';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData } from '../context/DataContext';

export default function Hero() {
  const { t } = useLanguage();
  const { heroImage } = useSiteData();

  return (
    <section className="relative min-h-screen pt-20 flex flex-col md:flex-row bg-white text-black overflow-hidden border-b border-black">
      <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-black relative z-10 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4 opacity-60 font-bold">{t.hero.est}</p>
          <h1 className="text-6xl md:text-[80px] lg:text-[110px] leading-[1.1] font-black uppercase tracking-tighter italic mb-8">
            {t.hero.title1}<br />{t.hero.title2}<br />{t.hero.title3}
          </h1>
          <p className="text-lg font-light leading-relaxed max-w-sm mb-12">
            {t.hero.desc}
          </p>
          <a
            href="#book"
            className="inline-flex items-center justify-center border border-black bg-white text-black px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            {t.hero.btn}
          </a>
        </motion.div>
      </div>
      
      <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-full bg-neutral-100 p-2">
        <img
          src={heroImage}
          alt="X-CUT Salon Interior"
          className="w-full h-full object-cover grayscale"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}
