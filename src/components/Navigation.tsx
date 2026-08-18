import { Menu, X, Globe, User } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();
  const { user, signOut, openLoginModal, isAdmin } = useAuth();

  const links = [
    ...(isAdmin ? [{ name: t.admin?.nav || 'Admin', href: '#admin' }] : []),
    { name: t.nav.works, href: '#works' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.book, href: '#book' },
    { name: t.nav.contact, href: '#contact' },
  ];

  return (
    <header className="fixed top-0 w-full bg-white border-b border-black z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="text-2xl font-black tracking-tighter uppercase text-black">
          X-CUT
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`${lang === 'zh' ? 'text-[13px] tracking-widest' : 'text-[11px] tracking-[0.2em]'} font-bold uppercase text-black hover:line-through transition-all`}
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className={`${lang === 'zh' ? 'text-[13px] tracking-widest' : 'text-[11px] tracking-[0.2em]'} font-bold uppercase text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors flex items-center gap-2`}
          >
            <Globe size={12} />
            {t.nav.toggle}
          </button>
          
          {user ? (
            <button
              onClick={signOut}
              className={`${lang === 'zh' ? 'text-[13px] tracking-widest' : 'text-[11px] tracking-[0.2em]'} font-bold uppercase text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors flex items-center gap-2`}
            >
              {t.nav.logout}
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className={`${lang === 'zh' ? 'text-[13px] tracking-widest' : 'text-[11px] tracking-[0.2em]'} font-bold uppercase text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors flex items-center gap-2`}
            >
              <User size={12} />
              {t.nav.login}
            </button>
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className={`${lang === 'zh' ? 'text-[13px] tracking-widest' : 'text-[11px] tracking-[0.2em]'} font-bold uppercase text-black border border-black px-2 py-1 flex items-center gap-1`}
          >
            <Globe size={12} />
            {t.nav.toggle}
          </button>

          {user ? (
            <button
              onClick={signOut}
              className={`${lang === 'zh' ? 'text-[13px] tracking-widest' : 'text-[11px] tracking-[0.2em]'} font-bold uppercase text-black border border-black px-2 py-1 flex items-center`}
            >
              {t.nav.logout}
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className={`${lang === 'zh' ? 'text-[13px] tracking-widest' : 'text-[11px] tracking-[0.2em]'} font-bold uppercase text-black border border-black px-2 py-1 flex items-center gap-1`}
            >
              <User size={12} />
            </button>
          )}

          <button
            className="text-black p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden border-t border-black bg-white">
          <div className="flex flex-col py-4 px-6 gap-4">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium uppercase tracking-wider text-black"
              >
                {link.name}
              </a>
            ))}
          </div>
        </nav>
      )}

      <LoginModal />
    </header>
  );
}
