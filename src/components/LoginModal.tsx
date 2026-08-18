import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import * as motion from 'motion/react-client';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function LoginModal() {
  const { t } = useLanguage();
  const { isLoginModalOpen, closeLoginModal } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  // Supabase Auth requires an email or a real phone number setup. 
  // To use "just a phone number" without actual SMS OTP setup, 
  // we map the phone number to a dummy email address.
  // We strip spaces and special characters but keep letters and numbers to allow the admin ID.
  // Using .com instead of .local because Supabase strictly validates TLDs.
  const getDummyEmail = (p: string) => {
    const cleanPhone = p.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return `${cleanPhone}@xcut-salon.com`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }

    setError(null);

    if (!isLogin) {
      if (phone !== confirmPhone) {
        setError(t.login?.phoneMismatch || 'Phone numbers do not match');
        return;
      }
      if (password !== confirmPassword) {
        setError(t.login?.passwordMismatch || 'Passwords do not match');
        return;
      }
    }

    setLoading(true);

    try {
      const email = getDummyEmail(phone);
      
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        closeLoginModal();
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: name,
              phone: phone
            }
          }
        });
        if (error) throw error;
        alert(t.login?.successSignUp || 'Account created successfully!');
        setIsLogin(true); // Switch to login view after successful signup
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeLoginModal}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-md border border-black p-8 sm:p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={closeLoginModal}
          className="absolute top-6 right-6 p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black"
          aria-label="Close"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8 border-b border-black pb-4">
          {isLogin ? (t.login?.signIn || 'Sign In') : (t.login?.signUp || 'Sign Up')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">
                {t.login?.name || 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-black/20 p-4 text-sm focus:border-black focus:outline-none transition-colors"
              />
            </div>
          )}
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">
              {t.login?.phone || 'Phone Number'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border border-black/20 p-4 text-sm focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">
                {t.login?.confirmPhone || 'Confirm Phone Number'}
              </label>
              <input
                type="tel"
                value={confirmPhone}
                onChange={(e) => setConfirmPhone(e.target.value)}
                required
                className="w-full border border-black/20 p-4 text-sm focus:border-black focus:outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">
              {t.login?.password || 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-black/20 p-4 text-sm focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">
                {t.login?.confirmPassword || 'Confirm Password'}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-black/20 p-4 text-sm focus:border-black focus:outline-none transition-colors"
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-xs font-medium bg-red-50 p-3 border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : (isLogin ? (t.login?.signInBtn || 'Sign In') : (t.login?.signUpBtn || 'Sign Up'))}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-black/10 pt-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[11px] uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity hover:line-through"
          >
            {isLogin ? (t.login?.noAccount || "Don't have an account? Sign Up") : (t.login?.hasAccount || 'Already have an account? Sign In')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
