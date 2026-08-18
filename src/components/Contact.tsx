import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t, lang } = useLanguage();
  
  const handleWhatsAppContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;
    
    let text = '';
    if (name) text += `${lang === 'en' ? 'Name' : '姓名'}: ${name}\n`;
    if (message) text += `${lang === 'en' ? 'Message' : '訊息'}:\n${message}`;
    
    const phone = '85292793183';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1px] bg-black border border-black">
          <div className="bg-white p-8 md:p-16 flex flex-col justify-between">
            <div>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic mb-6">
                {t.contact.title}
              </h2>
              <p className="text-black/60 text-lg font-light mb-12 max-w-md">
                {t.contact.desc}
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-[9px] uppercase opacity-50 mb-1 font-bold block tracking-widest">{t.contact.locTitle}</span>
                <p className="text-sm font-medium">
                  {t.contact.locDesc1}
                  {t.contact.locDesc2 && (
                    <>
                      <br />
                      {t.contact.locDesc2}
                    </>
                  )}
                </p>
              </div>
              <div>
                <span className="text-[9px] uppercase opacity-50 mb-1 font-bold block tracking-widest">{t.contact.hoursTitle}</span>
                <p className="text-sm font-medium">
                  {t.contact.hoursDesc1}
                  {t.contact.hoursDesc2 && (
                    <>
                      <br />
                      {t.contact.hoursDesc2}
                    </>
                  )}
                </p>
              </div>
              <div>
                <span className="text-[9px] uppercase opacity-50 mb-1 font-bold block tracking-widest">{t.contact.contactTitle}</span>
                <p className="text-sm font-medium">
                  WhatsApp: +852 9279 3183
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 p-8 md:p-16">
            <form className="space-y-6" onSubmit={handleWhatsAppContact}>
              <div>
                <label htmlFor="name" className="block text-[9px] font-bold uppercase tracking-[0.2em] mb-2 opacity-50 text-black">
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-black/20 py-3 text-black focus:outline-none focus:border-black transition-colors"
                  placeholder={t.contact.name}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-[9px] font-bold uppercase tracking-[0.2em] mb-2 opacity-50 text-black">
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full bg-transparent border-b border-black/20 py-3 text-black focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder={t.contact.message}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-colors flex justify-center items-center gap-2"
              >
                {t.contact.send} (WhatsApp)
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
