import type { Service, TimeSlot } from './types';

export const getServices = (lang: 'en' | 'zh'): Service[] => [
  { id: 's1', name: lang === 'en' ? "Men's Precision Cut" : '男士精剪', duration: lang === 'en' ? '30 min' : '30 分鐘', price: '$100' },
  { id: 's3', name: lang === 'en' ? 'Skin Fade' : '漸層油頭', duration: lang === 'en' ? '45 min' : '45 分鐘', price: '$120' },
  { id: 's2', name: lang === 'en' ? "Women's Precision Cut" : '女士精剪', duration: lang === 'en' ? '60 min' : '60 分鐘', price: '$120' },
];

export const generateTimeSlots = (): TimeSlot[] => {
  return [
    { id: 't1', time: '11:30', available: true },
    { id: 't2', time: '12:30', available: true },
    { id: 't3', time: '13:30', available: true },
    { id: 't4', time: '14:30', available: true },
    { id: 't5', time: '15:30', available: true },
    { id: 't6', time: '16:30', available: true },
    { id: 't7', time: '17:30', available: true },
    { id: 't8', time: '18:30', available: true },
    { id: 't9', time: '19:30', available: true },
    { id: 't10', time: '20:30', available: true },
  ];
};

export const getWorks = (lang: 'en' | 'zh') => [
  {
    id: 1,
    image: '/src/assets/images/salon_work_1_bw_1786863239831.jpg',
    title: lang === 'en' ? 'Hair Consultation' : '髮型諮詢',
  },
  {
    id: 2,
    image: '/src/assets/images/salon_work_2_bw_1786863251692.jpg',
    title: lang === 'en' ? 'Technique Driven' : '技術主導',
  },
  {
    id: 3,
    image: '/src/assets/images/salon_work_3_bw_1786863264593.jpg',
    title: lang === 'en' ? 'Styling Guidance' : '造型指導',
  },
];
