import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('tickets');
  const [settings, setSettings] = useState({
    ticketTitle: '', ticketDescription: '', ticketColor: '#5865f2',
    ticketCategory: '', ticketSupportRole: '', ticketReasons: ''
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) {
        setSettings({
          ...data,
          ticketReasons: data.ticketReasons ? data.ticketReasons.join(', ') : ''
        });
      }
    });
  }, []);

  const save = async () => {
    // تحويل النص إلى مصفوفة (Array) قبل الحفظ
    const reasonsArray = settings.ticketReasons.split(',').map(r => r.trim());
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, ticketReasons: reasonsArray })
    });
    alert('✅ تم حفظ الإعدادات بنجاح!');
  };

  if (!session) return <p style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول</p>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={{color:'#5865f2'}}>لوحة التحكم</h2>
        <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? styles.activeNav : styles.navBtn}>🎫 نظام التذاكر</button>
        <button onClick={save} style={styles.saveBtn}>حفظ الإعدادات</button>
      </aside>

      <main style={styles.content}>
        <div style={styles.card}>
          <h3>🎫 إعدادات التذاكر المتقدمة</h3>
          
          <label>ID فئة التذاكر (Category):</label>
          <input style={styles.input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})} />

          <label>ID رتبة الدعم:</label>
          <input style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})} />

          <label>أسباب التذاكر (افصل بينها بفاصلة ,):</label>
          <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} placeholder="مثال: شكوى, استفسار, شراء" />

          <label>عنوان رسالة التذكرة:</label>
          <input style={styles.input} value={settings.ticketTitle} onChange={e => setSettings({...settings, ticketTitle: e.target.value})} />
        </div>
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
