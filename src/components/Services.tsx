import { getServices } from '../data';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { t, lang } = useLanguage();
  const services = getServices(lang);

  return (
    <section id="services" className="py-24 bg-white text-black border-b border-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16 md:flex md:justify-between md:items-end border-b border-black pb-4">
          <div>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic">
              {t.services.title}
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-60 mt-4 md:mt-0 font-bold">
            {t.services.sub}
          </p>
        </div>

        <div className="flex flex-col">
          {services.map((svc) => (
            <div key={svc.id} className="flex justify-between items-end border-b border-black pb-4 pt-6 group hover:bg-black/5 transition-colors px-2 -mx-2">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold tracking-widest opacity-50 mb-1">{svc.duration}</span>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black group-hover:italic transition-all">
                  {svc.name}
                </h3>
              </div>
              <div className="text-sm font-bold text-black border border-black px-2 py-1">
                {svc.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
