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
        setSettings({ ...data, ticketReasons: data.ticketReasons ? data.ticketReasons.join(', ') : '' });
      }
    });
  }, []);

  const save = async () => {
    const reasonsArray = settings.ticketReasons.split(',').map(r => r.trim()).filter(r => r !== "");
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, ticketReasons: reasonsArray })
    });
    alert('✅ تم حفظ إعدادات التذاكر بنجاح!');
  };

  if (!session) return null;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h3 style={{color:'#5865f2', marginBottom:'20px'}}>لوحة التحكم</h3>
        <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? styles.activeNav : styles.navBtn}>🎫 نظام التذاكر</button>
        <button onClick={save} style={styles.saveBtn}>حفظ التغييرات</button>
      </aside>

      <main style={styles.main}>
        <div style={styles.card}>
          <h3 style={{borderBottom:'1px solid #444', paddingBottom:'10px'}}>🎫 إعدادات التذاكر المتقدمة</h3>
          
          <label style={styles.label}>أسباب التذاكر (افصل بينها بفاصلة ,):</label>
          <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} placeholder="مثال: شكوى, استفسار, شراء" />

          <label style={styles.label}>ID فئة التذاكر (Category):</label>
          <input style={styles.input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})} />

          <label style={styles.label}>ID رتبة الدعم:</label>
          <input style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})} />

          <label style={styles.label}>عنوان الإيمبد:</label>
          <input style={styles.input} value={settings.ticketTitle} onChange={e => setSettings({...settings, ticketTitle: e.target.value})} />
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#1e1f22', color: 'white', direction: 'rtl', fontFamily: 'sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#2b2d31', padding: '20px', borderLeft: '1px solid #111' },
  main: { flex: 1, padding: '40px' },
  navBtn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#b9bbbe', textAlign: 'right', cursor: 'pointer' },
  activeNav: { width: '100%', padding: '12px', backgroundColor: '#3f4147', color: 'white', borderRadius: '5px', textAlign: 'right' },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', fontWeight: 'bold' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '10px' },
  label: { display: 'block', marginTop: '15px', fontSize: '14px', color: '#949ba4' },
  input: { width: '100%', padding: '12px', backgroundColor: '#1e1f22', color: 'white', border: 'none', borderRadius: '5px', marginTop: '8px' }
};
