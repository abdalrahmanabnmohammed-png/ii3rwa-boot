import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [youtubeId, setYoutubeId] = useState('');
  const [antiLinks, setAntiLinks] = useState(false);

  // جلب البيانات القديمة من الداتابيز عند فتح الصفحة
  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if(data) {
        setYoutubeId(data.youtubeChannelId || '');
        setAntiLinks(data.antiLinks || false);
      }
    });
  }, []);

  const saveSettings = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ youtubeId, antiLinks })
    });
    alert('✅ تم حفظ الإعدادات بنجاح!');
  };

  if (!session) return <p>جاري التحميل...</p>;

  return (
    <div style={{ backgroundColor: '#2c2f33', color: 'white', minHeight: '100vh', padding: '40px' }}>
      <h1>لوحة التحكم - {session.user.name}</h1>
      <div style={{ background: '#23272a', padding: '20px', borderRadius: '10px', maxWidth: '500px' }}>
        <h3>قناة اليوتيوب</h3>
        <input value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} style={{ width: '100%', padding: '10px' }} />
        
        <h3>الحماية</h3>
        <label>
          <input type="checkbox" checked={antiLinks} onChange={(e) => setAntiLinks(e.target.checked)} /> تفعيل منع الروابط
        </label>
        
        <button onClick={saveSettings} style={{ display: 'block', width: '100%', marginTop: '20px', padding: '10px', backgroundColor: '#43b581', color: 'white', border: 'none', cursor: 'pointer' }}>حفظ</button>
      </div>
    </div>
  );
}
