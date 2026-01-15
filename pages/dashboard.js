import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('tickets');
  const [guildData, setGuildData] = useState({ roles: [], channels: [], categories: [] });
  const [settings, setSettings] = useState({
    ticketTitle: '', ticketDescription: '', ticketColor: '#5865f2',
    ticketCategory: '', ticketSupportRole: '', welcomeChannel: ''
  });

  useEffect(() => {
    // جلب الإعدادات من قاعدة البيانات
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(prev => ({...prev, ...data})));
    
    // جلب القنوات والرتب من البوت مباشرة (استبدل الرابط برابط Replit الخاص بك)
    fetch('https://your-replit-link.repl.co/guild-info')
      .then(res => res.json())
      .then(data => setGuildData(data))
      .catch(() => console.log("تأكد من تشغيل البوت ورابط Replit"));
  }, []);

  const saveSettings = async () => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (res.ok) alert('✅ تم حفظ الإعدادات بنجاح!');
  };

  if (!session) return <p style={{color:'white', textAlign:'center', marginTop:'50px'}}>يجب تسجيل الدخول أولاً</p>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={{color:'#5865f2'}}>Control Panel</h2>
        <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? styles.activeNav : styles.navBtn}>🎫 نظام التذاكر</button>
        <button onClick={() => setActiveTab('general')} style={activeTab === 'general' ? styles.activeNav : styles.navBtn}>⚙️ إعدادات عامة</button>
        <button onClick={saveSettings} style={styles.saveBtn}>حفظ التغييرات</button>
      </aside>

      <main style={styles.content}>
        {activeTab === 'tickets' && (
          <div style={styles.card}>
            <h3>🎫 إعدادات التذاكر</h3>
            
            <label>فئة التذاكر (Category):</label>
            <select style={styles.input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})}>
              <option value="">-- اختر الفئة --</option>
              {guildData.categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>

            <label>رتبة الدعم (سيتم عمل منشن لها):</label>
            <select style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})}>
              <option value="">-- اختر الرتبة --</option>
              {guildData.roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
            </select>

            <label>عنوان المنشور:</label>
            <input style={styles.input} value={settings.ticketTitle} onChange={e => setSettings({...settings, ticketTitle: e.target.value})} />
            
            <label>لون الرسالة:</label>
            <input type="color" style={{...styles.input, height:'40px'}} value={settings.ticketColor} onChange={e => setSettings({...settings, ticketColor: e.target.value})} />
          </div>
        )}

        {activeTab === 'general' && (
          <div style={styles.card}>
            <h3>⚙️ القنوات الأساسية</h3>
            <label>قناة الترحيب:</label>
            <select style={styles.input} value={settings.welcomeChannel} onChange={e => setSettings({...settings, welcomeChannel: e.target.value})}>
              <option value="">-- اختر قناة --</option>
              {guildData.channels.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
            </select>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', color: 'white', fontFamily: 'sans-serif' },
  sidebar: { width: '250px', backgroundColor: '#2b2d31', padding: '20px', display:'flex', flexDirection:'column', gap:'10px' },
  content: { flex: 1, padding: '40px', overflowY: 'auto' },
  navBtn: { padding: '12px', textAlign: 'left', backgroundColor: 'transparent', border: 'none', color: '#b9bbbe', cursor: 'pointer', borderRadius: '5px' },
  activeNav: { padding: '12px', textAlign: 'left', backgroundColor: '#3f4147', border: 'none', color: 'white', borderRadius: '5px' },
  card: { backgroundColor: '#2b2d31', padding: '25px', borderRadius: '10px', maxWidth: '600px' },
  input: { width: '100%', padding: '10px', margin: '10px 0 20px 0', backgroundColor: '#1e1f22', border: 'none', color: 'white', borderRadius: '5px' },
  saveBtn: { marginTop: 'auto', padding: '15px', backgroundColor: '#23a559', border: 'none', color: 'white', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }
};
