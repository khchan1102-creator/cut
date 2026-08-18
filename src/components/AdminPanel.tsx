import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData } from '../context/DataContext';
import { getServices, generateTimeSlots } from '../data';
import { Trash2, MessageCircle } from 'lucide-react';

export default function AdminPanel() {
  const { t, lang } = useLanguage();
  const { heroImage, worksImages, blockedSlots, refreshData } = useSiteData();
  const [activeTab, setActiveTab] = useState<'bookings' | 'blocks' | 'images'>('bookings');
  
  // Bookings Tab
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Blocks Tab
  const [blockDate, setBlockDate] = useState('');
  const [blockStartSlot, setBlockStartSlot] = useState('');
  const [blockEndSlot, setBlockEndSlot] = useState('');

  // Images Tab
  const [editHero, setEditHero] = useState(heroImage);
  const [editWorks, setEditWorks] = useState(worksImages);
  const [savingImages, setSavingImages] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingWorks, setUploadingWorks] = useState(false);
  
  // Track which booking is being cancelled for double-click confirm
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  // Filter Date for Bookings Tab
  const [filterDate, setFilterDate] = useState('');

  const services = getServices(lang);
  const slots = generateTimeSlots();

  useEffect(() => {
    setEditHero(heroImage);
    setEditWorks(worksImages);
  }, [heroImage, worksImages]);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    try {
      setUploadingHero(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('site_images').upload(fileName, file);
      
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site_images').getPublicUrl(fileName);
      setEditHero(data.publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image. Please ensure you created the "site_images" bucket in Supabase and made it public.');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleWorksUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !supabase) return;

    try {
      setUploadingWorks(true);
      const newUrls = [...editWorks];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('site_images').upload(fileName, file);
        
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('site_images').getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
      }
      
      setEditWorks(newUrls);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image(s). Please ensure you created the "site_images" bucket in Supabase and made it public.');
    } finally {
      setUploadingWorks(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Create a time string in "HH:MM" format based on local time
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${currentHour}:${currentMinute}`;
    
    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 14);
    const twoWeeksStr = twoWeeks.toISOString().split('T')[0];

    if (supabase) {
      let query = supabase.from('bookings').select('*').order('date', { ascending: true });
      
      if (filterDate) {
        query = query.eq('date', filterDate);
      } else {
        query = query.gte('date', today).lte('date', twoWeeksStr);
      }

      const { data, error } = await query;
      
      if (data && !error) {
        // Filter out past appointments for today
        const filteredBookings = data.filter((b: any) => {
          if (b.date > today) return true;
          if (b.date === today) {
            const slot = slots.find(s => s.id === b.slot_id);
            if (!slot) return true; // Keep if slot is somehow unknown
            return slot.time > currentTimeStr; // Only show future times
          }
          if (filterDate && filterDate < today) {
            return true; // if they explicitly select a past date, show it
          }
          return false;
        });
        setBookings(filteredBookings);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab, filterDate]);

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 8 ? `852${cleaned}` : cleaned;
  };

  const handleRemind = (b: any) => {
    const phone = formatPhone(b.customer_phone);
    const time = slots.find(s => s.id === b.slot_id)?.time || b.slot_id;
    const service = services.find(s => s.id === b.service_id)?.name || b.service_id;
    const msg = `溫馨提示：您在 X-Cut 預約了 ${b.date} ${time} ${service}。`;
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const handleCancel = async (b: any) => {
    if (!supabase) return;
    
    if (confirmCancelId !== b.id) {
      setConfirmCancelId(b.id);
      return;
    }

    setConfirmCancelId(null);

    const phone = formatPhone(b.customer_phone);
    const time = slots.find(s => s.id === b.slot_id)?.time || b.slot_id;
    const msg = `非常抱歉，您在 X-Cut ${b.date} ${time} 的預約需要被取消，請重新選擇時段。`;
    
    // Redirect to WhatsApp synchronously before async call if possible,
    // but here we wait for the database action first to be safe,
    // because window.location.href navigates away.
    // Instead of navigating away immediately, let's open in a new tab if allowed,
    // or navigate the parent if blocked. For AI Studio preview, we will just open a new tab and hope it works, 
    // or tell the user to open the app in a new tab.
    
    // Using .select() to verify if the row was actually deleted (Supabase RLS can silently block deletes)
    const { data, error } = await supabase.from('bookings').delete().eq('id', b.id).select();
    
    if (error) {
      console.error('Cancel error:', error);
      alert(lang === 'zh' ? `取消失敗：${error.message}` : `Failed to cancel booking: ${error.message}`);
    } else if (!data || data.length === 0) {
      console.error('Delete blocked by RLS');
      alert(lang === 'zh' 
        ? `取消失敗：資料庫權限拒絕 (Row Level Security)。請至 Supabase Dashboard 開啟 bookings 資料表的 DELETE 權限。` 
        : `Delete failed: Blocked by Database RLS policies. Please enable DELETE policies for the "bookings" table in your Supabase Dashboard.`);
    } else {
      fetchBookings();
      try {
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
      } catch (e) {
        console.log("Popup blocked", e);
      }
    }
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !blockDate) return;
    
    // Whole day block
    if (!blockStartSlot || !blockEndSlot) {
      await supabase.from('blocked_slots').insert([{
        date: blockDate,
        slot_id: null
      }]);
    } else {
      // Time range block
      const startIndex = slots.findIndex(s => s.id === blockStartSlot);
      const endIndex = slots.findIndex(s => s.id === blockEndSlot);
      
      if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
        const slotsToBlock = slots.slice(startIndex, endIndex + 1);
        const inserts = slotsToBlock.map(s => ({
          date: blockDate,
          slot_id: s.id
        }));
        await supabase.from('blocked_slots').insert(inserts);
      } else {
        alert("Invalid time range. End time must be after start time.");
        return;
      }
    }
    
    setBlockDate('');
    setBlockStartSlot('');
    setBlockEndSlot('');
    refreshData();
  };

  const handleRemoveBlock = async (id: string) => {
    if (!supabase) return;
    await supabase.from('blocked_slots').delete().eq('id', id);
    refreshData();
  };

  const handleSaveImages = async () => {
    if (!supabase) return;
    setSavingImages(true);
    
    const { error: heroError } = await supabase.from('site_images').upsert({ section_id: 'hero', urls: [editHero] }).select();
    const { error: worksError } = await supabase.from('site_images').upsert({ section_id: 'works', urls: editWorks }).select();
    
    if (heroError || worksError) {
      console.error('Error saving images:', heroError || worksError);
      alert(lang === 'zh' 
        ? `儲存失敗：資料庫權限拒絕 (Row Level Security)。請至 Supabase Dashboard 開啟 site_images 資料表的 INSERT 和 UPDATE 權限。` 
        : `Save failed: Blocked by Database RLS policies. Please enable INSERT and UPDATE policies for the "site_images" table in your Supabase Dashboard.`);
    } else {
      await refreshData();
      alert(lang === 'zh' ? '圖片儲存成功！' : 'Images saved successfully!');
    }
    
    setSavingImages(false);
  };

  return (
    <section className="pt-24 pb-12 px-6 bg-gray-50 border-b border-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 border-b border-black pb-4 flex items-end justify-between">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">
            {t.admin.title}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto hide-scrollbar">
          {['bookings', 'blocks', 'images'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-widest border border-black transition-colors shrink-0 ${
                activeTab === tab ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {t.admin.tabs?.[tab as keyof typeof t.admin.tabs] || tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white border border-black p-4 shadow-lg">
              <div className="flex items-center gap-4">
                <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                  {lang === 'zh' ? '選擇日期篩選' : 'Filter by Date'}
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border border-black p-2 text-sm focus:outline-none"
                />
                {filterDate && (
                  <button 
                    onClick={() => setFilterDate('')}
                    className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-800"
                  >
                    {lang === 'zh' ? '清除篩選' : 'Clear Filter'}
                  </button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto bg-white border border-black shadow-lg">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-black bg-black text-white uppercase tracking-widest text-[10px]">
                    <th className="p-4">{t.admin.date}</th>
                    <th className="p-4">{t.admin.time}</th>
                    <th className="p-4">{t.admin.service}</th>
                    <th className="p-4">{t.admin.customer}</th>
                    <th className="p-4">{t.admin.phone}</th>
                    <th className="p-4 text-right">{t.admin.actions}</th>
                  </tr>
                </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs uppercase tracking-widest">
                      Loading...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center opacity-50 italic">
                      {t.admin.noBookings}
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="border-b border-black/10 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold">{b.date}</td>
                      <td className="p-4">{slots.find(s => s.id === b.slot_id)?.time || b.slot_id}</td>
                      <td className="p-4">{services.find(s => s.id === b.service_id)?.name || b.service_id}</td>
                      <td className="p-4">{b.customer_name}</td>
                      <td className="p-4 font-mono">{b.customer_phone}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRemind(b)}
                            className="bg-green-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-green-700"
                          >
                            <MessageCircle size={12} />
                            {t.admin.remind}
                          </button>
                          {confirmCancelId === b.id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleCancel(b)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                              >
                                {lang === 'zh' ? '確認刪除' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setConfirmCancelId(null)}
                                className="bg-black hover:bg-gray-800 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                              >
                                {lang === 'zh' ? '返回' : 'Back'}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCancel(b)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                            >
                              <Trash2 size={12} />
                              {t.admin.cancel}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {activeTab === 'blocks' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-black p-6">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">{t.admin.blockTimeRange}</h3>
              <form onSubmit={handleAddBlock} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest opacity-60 mb-2">{t.admin.date}</label>
                  <input
                    type="date"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    required
                    className="w-full border border-black p-3 text-sm focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest opacity-60 mb-2">{t.admin.startTime}</label>
                    <select
                      value={blockStartSlot}
                      onChange={(e) => setBlockStartSlot(e.target.value)}
                      className="w-full border border-black p-3 text-sm focus:outline-none bg-white"
                    >
                      <option value="">-- {t.admin.wholeDay} --</option>
                      {slots.map(s => (
                        <option key={s.id} value={s.id}>{s.time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest opacity-60 mb-2">{t.admin.endTime}</label>
                    <select
                      value={blockEndSlot}
                      onChange={(e) => setBlockEndSlot(e.target.value)}
                      className="w-full border border-black p-3 text-sm focus:outline-none bg-white"
                    >
                      <option value="">-- {t.admin.wholeDay} --</option>
                      {slots.map(s => (
                        <option key={s.id} value={s.id}>{s.time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-[10px] opacity-60 italic mb-4">
                  * Leave both time fields as "Whole Day" to block the entire date.
                </p>
                <button type="submit" className="w-full bg-black text-white px-4 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gray-800">
                  {t.admin.addBlock}
                </button>
              </form>
            </div>

            <div className="bg-white border border-black p-6 overflow-y-auto max-h-[500px]">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">Current Blocks</h3>
              <ul className="space-y-2">
                {blockedSlots.map(b => (
                  <li key={b.id} className="flex items-center justify-between border border-black/10 p-3 text-sm">
                    <div>
                      <span className="font-bold">{b.date}</span>
                      <span className="mx-2">|</span>
                      <span>{b.slot_id ? slots.find(s => s.id === b.slot_id)?.time : t.admin.wholeDay}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveBlock(b.id)}
                      className="text-red-500 hover:text-red-700 uppercase tracking-widest text-[10px] font-bold"
                    >
                      {t.admin.remove}
                    </button>
                  </li>
                ))}
                {blockedSlots.length === 0 && <li className="text-sm opacity-50 italic">No blocks configured.</li>}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="bg-white border border-black p-6 max-w-3xl">
            {/* Hero Image Section */}
            <div className="mb-12 border-b border-black/10 pb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">{t.admin.heroImage}</h3>
              {editHero && (
                <div className="mb-4">
                  <img src={editHero} alt="Hero Preview" className="w-full max-w-sm aspect-[16/9] object-cover border border-black" />
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroUpload}
                  disabled={uploadingHero}
                  className="w-full border border-black p-3 text-sm focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:bg-black file:text-white hover:file:bg-gray-800 transition-colors"
                />
                {uploadingHero && (
                  <div className="absolute inset-y-0 right-4 flex items-center text-xs font-bold uppercase tracking-widest text-black/50">
                    {t.admin.uploading}
                  </div>
                )}
              </div>
            </div>

            {/* Works Images Section */}
            <div className="mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">{t.admin.worksImages}</h3>
              
              <div className="flex flex-wrap gap-4 mb-6">
                {editWorks.map((url, idx) => (
                  <div key={idx} className="relative group border border-black">
                    <img src={url} alt={`Work ${idx}`} className="w-24 h-32 md:w-32 md:h-48 object-cover" />
                    <button
                      onClick={() => {
                        const newWorks = [...editWorks];
                        newWorks.splice(idx, 1);
                        setEditWorks(newWorks);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleWorksUpload}
                  disabled={uploadingWorks}
                  className="w-full border border-black p-3 text-sm focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:bg-black file:text-white hover:file:bg-gray-800 transition-colors"
                />
                {uploadingWorks && (
                  <div className="absolute inset-y-0 right-4 flex items-center text-xs font-bold uppercase tracking-widest text-black/50">
                    {t.admin.uploading}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="border-t border-black pt-6">
              <button
                onClick={handleSaveImages}
                disabled={savingImages || uploadingHero || uploadingWorks}
                className="w-full bg-black text-white px-6 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {savingImages ? t.admin.saving : t.admin.saveImages}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
