import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('tickets');
  const [guildData, setGuildData] = useState({ roles: [], channels: [], categories: [] });
  const [settings, setSettings] = useState({
    ticketTitle: '', ticketDescription: '', ticketColor: '#5865f2',
    ticketCategory: '', ticketSupportRole: ''
  });

  // ضع الرابط الذي يظهر في كونسول ريبليت هنا
  const REPLIT_URL = "PASTE_YOUR_LINK_HERE"; 

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(prev => ({...prev, ...data})));
    
    if (REPLIT_URL !== "PASTE_YOUR_LINK_HERE") {
      fetch(`${REPLIT_URL}/guild-info`)
        .then(res => res.json())
        .then(data => setGuildData(data))
        .catch(e => console.log("خطأ في الاتصال بالبوت"));
    }
  }, []);

  const save = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    alert('✅ تم الحفظ!');
  };

  if (!session) return <div style={{color:'white', padding:'50px'}}>يرجى تسجيل الدخول</div>;

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2>Pro Control</h2>
        <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? styles.activeNav : styles.navBtn}>🎫 التذاكر</button>
        <button onClick={save} style={styles.saveBtn}>حفظ الإعدادات</button>
      </div>

      <div style={styles.main}>
        <div style={styles.card}>
          <h3>إعدادات التذاكر المتقدمة</h3>
          <label>الفئة (Category):</label>
          <select style={styles.input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})}>
            <option value="">-- اختر الفئة --</option>
            {guildData.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label>رتبة الدعم:</label>
          <select style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})}>
            <option value="">-- اختر الرتبة --</option>
            {guildData.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          <label>عنوان المنشور:</label>
          <input style={styles.input} value={settings.ticketTitle} onChange={e => setSettings({...settings, ticketTitle: e.target.value})} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', color: 'white' },
  sidebar: { width: '250px', backgroundColor: '#2b2d31', padding: '20px', display:'flex', flexDirection:'column' },
  main: { flex: 1, padding: '40px' },
  navBtn: { padding: '12px', textAlign: 'left', background: 'none', border: 'none', color: '#b9bbbe', cursor: 'pointer' },
  activeNav: { padding: '12px', textAlign: 'left', backgroundColor: '#3f4147', color: 'white', border: 'none', borderRadius: '5px' },
  saveBtn: { marginTop: '20px', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  card: { backgroundColor: '#2b2d31', padding: '25px', borderRadius: '10px' },
  input: { width: '100%', padding: '12px', margin: '10px 0 20px 0', backgroundColor: '#1e1f22', color: 'white', border: 'none', borderRadius: '5px' }
};
