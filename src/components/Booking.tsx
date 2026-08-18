import { useState, useEffect } from 'react';
import * as motion from 'motion/react-client';
import { Check, X } from 'lucide-react';
import { getServices, generateTimeSlots } from '../data';
import type { BookingState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useSiteData } from '../context/DataContext';

export default function Booking() {
  const { t, lang } = useLanguage();
  const { user, openLoginModal } = useAuth();
  const { blockedSlots } = useSiteData();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [booking, setBooking] = useState<BookingState>({
    date: null,
    serviceId: null,
    slotId: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  const services = getServices(lang);
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (booking.date && supabase) {
      const fetchBookings = async () => {
        const { data, error } = await supabase
          .from('bookings')
          .select('slot_id')
          .eq('date', booking.date);
        
        if (data && !error) {
          setBookedSlots(data.map((b: any) => b.slot_id));
        }
      };
      fetchBookings();
    } else {
      setBookedSlots([]);
    }
  }, [booking.date]);

  // Generate next 14 days
  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const dayName = date.toLocaleDateString(lang === 'zh' ? 'zh-HK' : 'en-US', { weekday: 'short' });
      dates.push({
        id: `${date.getFullYear()}-${month}-${day}`,
        display: `${month}/${day}`,
        dayName,
      });
    }
    return dates;
  };
  const dates = getDates();

  const handleBook = async () => {
    if (!user) {
      openLoginModal();
      return;
    }

    setIsSubmitting(true);
    
    if (supabase) {
      // Check 14-day booking limit
      const today = new Date();
      const twoWeeks = new Date();
      twoWeeks.setDate(today.getDate() + 14);
      
      const { data: existing, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', user.id)
        .gte('date', today.toISOString().split('T')[0])
        .lte('date', twoWeeks.toISOString().split('T')[0]);

      if (existing && existing.length > 0) {
        setShowLimitPopup(true);
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .insert([{
          date: booking.date,
          slot_id: booking.slotId,
          service_id: booking.serviceId,
          user_id: user.id,
          customer_name: user.user_metadata?.full_name || 'Unknown',
          customer_phone: user.user_metadata?.phone || 'Unknown'
        }]);
        
      if (error) {
        console.error('Booking error:', error);
        alert(lang === 'zh' ? '抱歉，該時段已被預約，請選擇其他時段。' : 'Sorry, this slot was just taken. Please choose another.');
        setIsSubmitting(false);
        return;
      }
    } else {
      // Mock API call if no Supabase configured
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setIsSubmitting(false);
    setStep(4);
  };

  return (
    <section id="book" className="py-24 bg-white text-black border-b border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 border-b border-black pb-4 flex flex-col md:flex-row md:items-end justify-between">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic">
            {t.booking.title}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-60 mt-4 md:mt-0 font-bold">
            {t.booking.sub}
          </p>
        </div>

        <div className="max-w-3xl mx-auto border border-black bg-white p-8 md:p-12">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-6 border-b border-black pb-4">
                  {t.booking.step1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => setBooking({ ...booking, serviceId: svc.id })}
                      className={`text-left p-6 border transition-all ${
                        booking.serviceId === svc.id
                          ? 'border-black bg-black text-white'
                          : 'border-black/20 hover:border-black text-black'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold uppercase tracking-wider text-sm">{svc.name}</span>
                        <span className="font-medium text-sm">{svc.price}</span>
                      </div>
                      <div className={`text-xs uppercase tracking-widest ${
                        booking.serviceId === svc.id ? 'text-white/60' : 'text-black/40'
                      }`}>
                        {svc.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  disabled={!booking.serviceId}
                  onClick={() => setStep(2)}
                  className="bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {t.booking.continue}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-6 border-b border-black pb-4">
                  {t.booking.step2}
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                  {dates.map((d) => {
                    const isFullyBlocked = blockedSlots.some(b => b.date === d.id && !b.slot_id);
                    return (
                    <button
                      key={d.id}
                      disabled={isFullyBlocked}
                      onClick={() => setBooking({ ...booking, date: d.id })}
                      className={`p-4 text-center border transition-all text-sm font-bold uppercase ${
                        isFullyBlocked 
                          ? 'border-black/10 text-black/20 cursor-not-allowed bg-gray-50'
                          : booking.date === d.id
                          ? 'border-black bg-black text-white'
                          : 'border-black/20 hover:border-black text-black'
                      }`}
                    >
                      <span className="block text-[10px] opacity-60 mb-1 tracking-widest">{d.dayName}</span>
                      <span className="tracking-tighter">{d.display}</span>
                    </button>
                  )})}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors"
                >
                  {t.booking.back}
                </button>
                <button
                  disabled={!booking.date}
                  onClick={() => setStep(3)}
                  className="bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {t.booking.continue}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-6 border-b border-black pb-4">
                  {t.booking.step3}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {timeSlots.map((slot) => {
                    const isSlotBlocked = blockedSlots.some(b => b.date === booking.date && (b.slot_id === slot.id || !b.slot_id));
                    
                    // Check if time has passed for today
                    let isPassed = false;
                    const now = new Date();
                    const todayStr = now.toISOString().split('T')[0];
                    if (booking.date === todayStr) {
                      const currentHour = now.getHours().toString().padStart(2, '0');
                      const currentMinute = now.getMinutes().toString().padStart(2, '0');
                      const currentTimeStr = `${currentHour}:${currentMinute}`;
                      if (slot.time < currentTimeStr) {
                        isPassed = true;
                      }
                    }

                    const isActuallyAvailable = slot.available && !bookedSlots.includes(slot.id) && !isSlotBlocked && !isPassed;
                    
                    return (
                    <button
                      key={slot.id}
                      disabled={!isActuallyAvailable}
                      onClick={() => setBooking({ ...booking, slotId: slot.id })}
                      className={`p-4 text-center border transition-all text-sm font-bold tracking-widest uppercase ${
                        !isActuallyAvailable
                          ? 'border-black/10 text-black/20 cursor-not-allowed'
                          : booking.slotId === slot.id
                          ? 'border-black bg-black text-white'
                          : 'border-black/20 hover:border-black text-black'
                      }`}
                    >
                      {slot.time}
                    </button>
                  )})}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors"
                >
                  {t.booking.back}
                </button>
                <button
                  disabled={!booking.slotId || isSubmitting}
                  onClick={handleBook}
                  className="bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? t.booking.confirming : t.booking.confirm}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">
                {t.booking.successTitle}
              </h3>
              <p className="text-black/60 text-lg font-light mb-8 max-w-md mx-auto">
                {t.booking.successDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    const svc = services.find(s => s.id === booking.serviceId)?.name || '';
                    const time = timeSlots.find(s => s.id === booking.slotId)?.time || '';
                    const date = booking.date || '';
                    const message = lang === 'zh' 
                      ? `你好！我已經預約了 ${date} 的 ${time} 的 ${svc}！`
                      : `Hello! I have booked a ${svc} on ${date} at ${time}!`;
                    const whatsappUrl = `https://wa.me/85292793183?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-all w-full sm:w-auto"
                >
                  {t.booking.whatsappBtn}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {showLimitPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLimitPopup(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-md border border-black p-8 sm:p-12 shadow-2xl text-center"
          >
            <button
              onClick={() => setShowLimitPopup(false)}
              className="absolute top-6 right-6 p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
            
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-red-600">
              {lang === 'zh' ? '預約限制' : 'Booking Limit'}
            </h3>
            <p className="text-black/70 font-medium mb-8">
              {t.errors?.bookingLimit || 'You can only book one time slot per 14 days.'}
            </p>
            <button
              onClick={() => setShowLimitPopup(false)}
              className="bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-all w-full"
            >
              {t.terms?.close || 'Close'}
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
