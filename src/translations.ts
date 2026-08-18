export const translations = {
  en: {
    nav: { works: 'Works', services: 'Services', book: 'Book', contact: 'Contact', toggle: '中', login: 'Login', logout: 'Logout' },
    hero: { est: `Est. ${new Date().getFullYear()} / Studio`, title1: 'Beauty', title2: 'Is', title3: 'Essential', desc: 'High-precision hair styling and aesthetic treatments for the modern soul. Minimalist form, maximum expression.', btn: 'Make Appointment' },
    works: { title: 'Our Works', sub: 'Editorial / Cut / Form', view: 'View Menu' },
    services: { title: 'Menu', sub: 'Tailored services' },
    booking: { title: 'Book Appointment', sub: 'Reserve your time', step1: '1. Select Service', step2: '2. Select Date', step3: '3. Select Time', continue: 'Continue', back: 'Back', confirm: 'Confirm Booking', confirming: 'Confirming...', successTitle: 'Booking Confirmed', successDesc: 'Please WhatsApp our stylist to confirm your appointment.', whatsappBtn: 'WhatsApp to Confirm', bookAnother: 'Book Another' },
    contact: { title: 'Inquiries', desc: 'Have questions about our services or need to modify an appointment? Reach out to our team.', locTitle: 'Location', locDesc1: 'Shop 165, 1/F, Fullview Shopping Centre', locDesc2: 'Siu Sai Wan, Chai Wan', hoursTitle: 'Hours', hoursDesc1: 'Monday to Sunday 11:30 - 21:30', hoursDesc2: '', contactTitle: 'Contact', name: 'Name', email: 'Email', message: 'Message', send: 'Send Message' },
    footer: { copy: `© ${new Date().getFullYear()} X-CUT Salon`, terms: 'Terms of Service' },
    terms: {
      title: 'Terms of Service',
      close: 'Close',
      sections: [
        { title: 'Booking Policy', content: 'All bookings require a confirmation via WhatsApp to secure your time slot. Appointments not confirmed within 12 hours may be cancelled.' },
        { title: 'Cancellation Policy', content: 'We value your time and ours. If you need to cancel or reschedule, please notify us at least 24 hours in advance.' },
        { title: 'Late Arrivals', content: 'If you arrive more than 15 minutes late for your appointment, we may need to shorten your service or reschedule to avoid delaying other clients.' }
      ]
    },
    login: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      name: 'Full Name',
      phone: 'Phone Number',
      confirmPhone: 'Confirm Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signInBtn: 'Sign In',
      signUpBtn: 'Create Account',
      noAccount: "Don't have an account? Sign Up",
      hasAccount: 'Already have an account? Sign In',
      phoneMismatch: 'Phone numbers do not match',
      passwordMismatch: 'Passwords do not match',
      successSignUp: 'Account created successfully! You can now log in.'
    },
    admin: {
      nav: 'Admin',
      title: 'Admin Dashboard',
      date: 'Date',
      time: 'Time',
      service: 'Service',
      customer: 'Customer',
      phone: 'Phone',
      noBookings: 'No bookings in the next 14 days.',
      fetchError: 'Failed to fetch bookings.',
      tabs: {
        bookings: 'Bookings',
        blocks: 'Schedule Blocks',
        images: 'Website Images'
      },
      actions: 'Actions',
      cancel: 'Cancel',
      remind: 'Remind',
      blockTimeRange: 'Block Date & Time',
      startTime: 'Start Time',
      endTime: 'End Time',
      wholeDay: 'Whole Day',
      addBlock: 'Add Block',
      remove: 'Remove',
      heroImage: 'Hero Image',
      worksImages: 'Works Images',
      uploadImage: 'Upload Image',
      uploading: 'Uploading...',
      saveImages: 'Save Images',
      saving: 'Saving...'
    },
    errors: {
      bookingLimit: 'You can only book one time slot per 14 days.'
    }
  },
  zh: {
    nav: { works: '作品', services: '服務', book: '預約', contact: '聯絡我們', toggle: 'EN', login: '登入', logout: '登出' },
    hero: { est: `始於 ${new Date().getFullYear()} / 工作室`, title1: '極致', title2: '剪裁', title3: '美學', desc: '專為現代靈魂打造的高精度髮型設計與美學護理。極簡形式，極致展現。', btn: '進行預約' },
    works: { title: '我們的作品', sub: '雜誌 / 剪裁 / 輪廓', view: '查看服務' },
    services: { title: '服務選單', sub: '量身定制的服務' },
    booking: { title: '預約服務', sub: '保留您的專屬時間', step1: '1. 選擇服務', step2: '2. 選擇日期', step3: '3. 選擇時間', continue: '繼續', back: '返回', confirm: '確認預約', confirming: '確認中...', successTitle: '預約已確認', successDesc: '請 WhatsApp 我們的髮型師以確認您的預約。', whatsappBtn: 'WhatsApp 確認', bookAnother: '再次預約' },
    contact: { title: '查詢', desc: '對我們的服務有疑問或需要修改預約？請與我們的團隊聯絡。', locTitle: '地點', locDesc1: '柴灣小西灣富景商場1樓165號舖', locDesc2: '', hoursTitle: '營業時間', hoursDesc1: '星期一至日：11:30 - 21:30', hoursDesc2: '', contactTitle: '聯絡', name: '姓名', email: '電郵', message: '訊息', send: '發送訊息' },
    footer: { copy: `© ${new Date().getFullYear()} X-CUT Salon`, terms: '服務條款' },
    terms: {
      title: '服務條款',
      close: '關閉',
      sections: [
        { title: '預約政策', content: '所有預約均需透過 WhatsApp 確認以保留您的專屬時段。未在12小時內確認的預約可能會被取消。' },
        { title: '取消政策', content: '我們非常重視您的時間。若您需要取消或更改預約，請至少提前 24 小時通知我們。' },
        { title: '遲到安排', content: '若您遲到超過 15 分鐘，我們可能需要縮短您的服務時間或為您重新安排時間，以免影響其他顧客。' }
      ]
    },
    login: {
      signIn: '登入',
      signUp: '註冊',
      name: '全名',
      phone: '電話號碼',
      confirmPhone: '確認電話號碼',
      password: '密碼',
      confirmPassword: '確認密碼',
      signInBtn: '登入',
      signUpBtn: '建立帳戶',
      noAccount: '沒有帳戶？請註冊',
      hasAccount: '已經有帳戶？請登入',
      phoneMismatch: '電話號碼不相符',
      passwordMismatch: '密碼不相符',
      successSignUp: '帳戶建立成功！您現在可以登入了。'
    },
    admin: {
      nav: '管理員',
      title: '管理員面板',
      date: '日期',
      time: '時間',
      service: '服務',
      customer: '顧客',
      phone: '電話',
      noBookings: '未來14天內沒有預約。',
      fetchError: '獲取預約記錄失敗。',
      tabs: {
        bookings: '預約記錄',
        blocks: '日程封鎖',
        images: '網站圖片'
      },
      actions: '操作',
      cancel: '取消',
      remind: '提醒',
      blockTimeRange: '封鎖日期與時間範圍',
      startTime: '開始時間',
      endTime: '結束時間',
      wholeDay: '全天',
      addBlock: '加入封鎖',
      remove: '移除',
      heroImage: '主視覺圖片',
      worksImages: '作品集圖片',
      uploadImage: '上傳圖片',
      uploading: '上傳中...',
      saveImages: '儲存變更',
      saving: '儲存中...'
    },
    errors: {
      bookingLimit: '您在14天內只能預約一個時段。'
    }
  }
};
