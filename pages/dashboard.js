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

  const REPLIT_URL = "https://ii3rwa.abdalrahmanabn2.replit.dev";

  useEffect(() => {
    // جلب الإعدادات من قاعدة بياناتك
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(prev => ({...prev, ...data})));
    
    // محاولة جلب الرتب والقنوات من البوت
    const loadGuildInfo = async () => {
      try {
        const response = await fetch(`${REPLIT_URL}/guild-info`);
        if (response.ok) {
          const data = await response.json();
          setGuildData(data);
        }
      } catch (err) {
        console.error("خطأ: تأكد من تشغيل البوت في Replit");
      }
    };

    loadGuildInfo();
  }, []);

  const save = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    alert('✅ تم الحفظ بنجاح!');
  };

  if (!session) return <p style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول</p>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1e1f22', color: 'white', direction: 'rtl', fontFamily: 'Arial' }}>
      <aside style={{ width: '260px', backgroundColor: '#2b2d31', padding: '20px', borderLeft: '1px solid #1e1f22' }}>
        <h2 style={{ color: '#5865f2' }}>لوحة التحكم</h2>
        <button onClick={() => setActiveTab('tickets')} style={btnStyle(activeTab === 'tickets')}>🎫 نظام التذاكر</button>
        <button onClick={() => setActiveTab('general')} style={btnStyle(activeTab === 'general')}>⚙️ إعدادات عامة</button>
        <button onClick={save} style={{ ...btnStyle(false), backgroundColor: '#23a559', color: 'white', marginTop: '20px', fontWeight: 'bold' }}>حفظ التغييرات</button>
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        {activeTab === 'tickets' && (
          <div style={cardStyle}>
            <h3 style={{marginBottom:'20px'}}>🎫 تخصيص التذاكر</h3>
            
            <label>فئة التذاكر (Category):</label>
            <select style={inputStyle} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})}>
              <option value="">-- اختر الفئة من القائمة --</option>
              {guildData.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <label>رتبة الدعم (سيتم عمل منشن لها):</label>
            <select style={inputStyle} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})}>
              <option value="">-- اختر الرتبة من القائمة --</option>
              {guildData.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>

            <label>عنوان رسالة التذاكر:</label>
            <input style={inputStyle} value={settings.ticketTitle} onChange={e => setSettings({...settings, ticketTitle: e.target.value})} />
          </div>
        )}

        {activeTab === 'general' && (
          <div style={cardStyle}>
            <h3>⚙️ الإعدادات العامة</h3>
            <label>قناة الترحيب:</label>
            <select style={inputStyle} value={settings.welcomeChannel} onChange={e => setSettings({...settings, welcomeChannel: e.target.value})}>
               <option value="">-- اختر القناة --</option>
               {guildData.channels.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
            </select>
          </div>
        )}
      </main>
    </div>
  );
}

const btnStyle = (active) => ({ width: '100%', padding: '12px', marginBottom: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', textAlign: 'right', color: active ? 'white' : '#b9bbbe', backgroundColor: active ? '#3f4147' : 'transparent' });
const cardStyle = { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' };
const inputStyle = { width: '100%', padding: '12px', margin: '10px 0 25px 0', backgroundColor: '#1e1f22', color: 'white', border: 'none', borderRadius: '5px', outline: 'none' };
