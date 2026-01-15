import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('info');
  const [settings, setSettings] = useState({
    infoTitle: '', infoDescription: '', infoImage: '', infoThumbnail: '', infoColor: '#5865f2',
    ticketTitle: '', ticketDescription: '', ticketCategory: '', ticketSupportRole: '', ticketReasons: ''
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) setSettings({ ...data, ticketReasons: data.ticketReasons?.join(', ') || '' });
    });
  }, []);

  const save = async () => {
    const reasons = settings.ticketReasons.split(',').map(r => r.trim());
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, ticketReasons: reasons }),
    });
    alert('✅ تم الحفظ!');
  };

  if (!session) return null;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={{color:'#5865f2'}}>لوحة التحكم</h2>
        <button onClick={() => setActiveTab('info')} style={activeTab === 'info' ? styles.activeNav : styles.navBtn}>ℹ️ منشور المعلومات</button>
        <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? styles.activeNav : styles.navBtn}>🎫 نظام التذاكر</button>
        <button onClick={save} style={styles.saveBtn}>حفظ التغييرات</button>
      </aside>

      <main style={styles.content}>
        {activeTab === 'info' && (
          <div style={styles.card}>
            <h3>ℹ️ تخصيص منشور المعلومات</h3>
            <label>العنوان:</label>
            <input style={styles.input} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} />
            <label>الوصف (استخدم \n للسطر الجديد):</label>
            <textarea style={{...styles.input, height:'150px'}} value={settings.infoDescription} onChange={e => setSettings({...settings, infoDescription: e.target.value})} />
            <label>رابط الصورة الكبيرة (Banner):</label>
            <input style={styles.input} value={settings.infoImage} onChange={e => setSettings({...settings, infoImage: e.target.value})} />
            <label>رابط الصورة الصغيرة (Thumbnail):</label>
            <input style={styles.input} value={settings.infoThumbnail} onChange={e => setSettings({...settings, infoThumbnail: e.target.value})} />
            <p style={{fontSize:'12px', color:'#aaa'}}>استخدم الأمر `#setup-info` في ديسكورد للإرسال.</p>
          </div>
        )}
        {/* قسم التذاكر يظل كما هو في الأكواد السابقة */}
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#1e1f22', color: 'white', direction: 'rtl' },
  sidebar: { width: '250px', backgroundColor: '#2b2d31', padding: '20px' },
  content: { flex: 1, padding: '40px' },
  navBtn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#b9bbbe', textAlign: 'right', cursor: 'pointer' },
  activeNav: { width: '100%', padding: '12px', backgroundColor: '#3f4147', color: 'white', borderRadius: '5px', textAlign: 'right' },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', fontWeight: 'bold' },
  card: { backgroundColor: '#2b2d31', padding: '25px', borderRadius: '10px' },
  input: { width: '100%', padding: '10px', margin: '10px 0 20px 0', backgroundColor: '#1e1f22', color: 'white', border: 'none', borderRadius: '5px' }
};
