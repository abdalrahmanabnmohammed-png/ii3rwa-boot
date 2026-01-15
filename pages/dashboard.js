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
    // جلب الإعدادات من MongoDB عبر الـ API الداخلي للموقع
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(prev => ({...prev, ...data})));
    
    // جلب الرتب والقنوات من البوت مباشرة
    const loadInfo = async () => {
      try {
        const res = await fetch(`${REPLIT_URL}/guild-info`, { method: 'GET', mode: 'cors' });
        const data = await res.json();
        if (data.roles) setGuildData(data);
      } catch (e) { console.error("البوت لا يستجيب للموقع"); }
    };
    loadInfo();
  }, []);

  const save = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    alert('✅ تم الحفظ! جرب الآن #setup-tickets');
  };

  if (!session) return <p style={{color:'white', textAlign:'center', marginTop:'100px'}}>يرجى تسجيل الدخول</p>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1e1f22', color: 'white', direction: 'rtl', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '250px', backgroundColor: '#2b2d31', padding: '20px', borderLeft: '1px solid #111' }}>
        <h2 style={{color:'#5865f2'}}>Pro Bot Control</h2>
        <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? activeBtn : navBtn}>🎫 التذاكر</button>
        <button onClick={() => setActiveTab('general')} style={activeTab === 'general' ? activeBtn : navBtn}>⚙️ عام</button>
        <button onClick={save} style={saveBtn}>حفظ الإعدادات</button>
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        <div style={{ backgroundColor: '#2b2d31', padding: '30px', borderRadius: '10px' }}>
          <h3>تخصيص الخيارات</h3>
          
          <label>الفئة (Category):</label>
          <select style={inputStyle} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})}>
            <option value="">-- اختر الفئة --</option>
            {guildData.categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label>رتبة الدعم:</label>
          <select style={inputStyle} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})}>
            <option value="">-- اختر الرتبة --</option>
            {guildData.roles?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          <label>عنوان رسالة التذكرة:</label>
          <input style={inputStyle} value={settings.ticketTitle} onChange={e => setSettings({...settings, ticketTitle: e.target.value})} />
        </div>
      </main>
    </div>
  );
}

const navBtn = { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#b9bbbe', textAlign: 'right', cursor: 'pointer' };
const activeBtn = { ...navBtn, backgroundColor: '#3f4147', color: 'white', borderRadius: '5px' };
const saveBtn = { width: '100%', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '12px', backgroundColor: '#1e1f22', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px', marginBottom: '20px' };
