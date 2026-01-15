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

  // الرابط الخاص بك من Replit
  const REPLIT_URL = "https://ii3rwa.abdalrahmanabn2.replit.dev"; 

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(prev => ({...prev, ...data})));
    
    fetch(`${REPLIT_URL}/guild-info`)
      .then(res => res.json())
      .then(data => setGuildData(data))
      .catch(() => console.log("تأكد من تشغيل البوت في Replit أولاً"));
  }, []);

  const save = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    alert('✅ تم حفظ الإعدادات!');
  };

  if (!session) return <p>يرجى تسجيل الدخول</p>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1e1f22', color: 'white', direction: 'rtl' }}>
      <aside style={{ width: '250px', backgroundColor: '#2b2d31', padding: '20px' }}>
        <h2>لوحة التحكم</h2>
        <button onClick={() => setActiveTab('tickets')} style={btnStyle}>🎫 التذاكر</button>
        <button onClick={() => setActiveTab('general')} style={btnStyle}>⚙️ عام</button>
        <button onClick={save} style={{ ...btnStyle, backgroundColor: '#23a559', marginTop: '20px' }}>حفظ التغييرات</button>
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        {activeTab === 'tickets' && (
          <div style={cardStyle}>
            <h3>🎫 إعدادات التذاكر</h3>
            <label>فئة التذاكر (Category):</label>
            <select style={inputStyle} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})}>
              <option value="">-- اختر الفئة --</option>
              {guildData.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <label>رتبة الدعم (منشن وإضافة):</label>
            <select style={inputStyle} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})}>
              <option value="">-- اختر الرتبة --</option>
              {guildData.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>

            <label>عنوان المنشور:</label>
            <input style={inputStyle} value={settings.ticketTitle} onChange={e => setSettings({...settings, ticketTitle: e.target.value})} />
          </div>
        )}
      </main>
    </div>
  );
}

const btnStyle = { width: '100%', padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', textAlign: 'right', color: 'white', backgroundColor: 'transparent' };
const cardStyle = { backgroundColor: '#2b2d31', padding: '25px', borderRadius: '10px' };
const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#1e1f22', color: 'white', border: 'none', borderRadius: '5px' };
