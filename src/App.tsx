import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Works from './components/Works';
import Services from './components/Services';
import Booking from './components/Booking';
import Contact from './components/Contact';
import TermsModal from './components/TermsModal';
import AdminPanel from './components/AdminPanel';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function AppContent() {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('main');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' && isAdmin) {
        setCurrentView('admin');
      } else {
        setCurrentView('main');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdmin]);
  
  if (currentView === 'admin' && isAdmin) {
    return (
      <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
        <Navigation />
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white scroll-smooth">
      <Navigation />
      
      <main>
        <Hero />
        <Works />
        <Services />
        <Booking />
        <Contact />
      </main>

      <footer className="px-6 py-6 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.2em] font-bold opacity-50 border-t border-black bg-white text-black">
        <div>{t.footer.copy}</div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="https://www.instagram.com/x_cut_atelier" target="_blank" rel="noopener noreferrer" className="hover:line-through">Instagram</a>
          <a href="https://www.threads.com/@x_cut_atelier?igshid=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" className="hover:line-through">Threads</a>
          <button onClick={() => setIsTermsOpen(true)} className="hover:line-through uppercase">{t.footer.terms}</button>
        </div>
      </footer>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
