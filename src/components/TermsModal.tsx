import { X } from 'lucide-react';
import * as motion from 'motion/react-client';
import { useLanguage } from '../context/LanguageContext';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-black p-8 sm:p-12 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black"
          aria-label={t.terms.close}
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8 border-b border-black pb-4">
          {t.terms.title}
        </h2>

        <div className="space-y-8">
          {t.terms.sections.map((section: any, idx: number) => (
            <div key={idx}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
                {section.title}
              </h3>
              <p className="text-sm leading-relaxed text-black/70">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-black/10">
          <button
            onClick={onClose}
            className="w-full bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-all"
          >
            {t.terms.close}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
