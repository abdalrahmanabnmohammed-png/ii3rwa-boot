import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function FullDashboard() {
  const { data: session } = useSession();
  const [tab, setTab] = useState('overview');
  const [settings, setSettings] = useState({ welcomeCh: '', antiLink: false, levels: true, ticketReasons: '' });

  const save = async () => {
    await fetch('/api/settings', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(settings) });
    alert('✅ تم تحديث جميع الأنظمة!');
  };

  if (!session) return <div style={{color:'white', textAlign:'center', padding:'50px'}}>جاري الدخول...</div>;

  return (
    <div style={{display:'flex', minHeight:'100vh', backgroundColor:'#1e1f22', direction:'rtl', color:'white'}}>
      <aside style={{width:'260px', backgroundColor:'#2b2d31', padding:'20px'}}>
        <h2>ii3RwA Control</h2>
        <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'20px'}}>
          <button onClick={() => setTab('general')} style={btnStyle}>⚙️ إعدادات عامة</button>
          <button onClick={() => setTab('tickets')} style={btnStyle}>🎫 التذاكر</button>
          <button onClick={() => setTab('security')} style={btnStyle}>🛡️ الحماية</button>
          <button onClick={() => setTab('levels')} style={btnStyle}>📊 اللفلات</button>
          <button onClick={save} style={{...btnStyle, backgroundColor:'#23a559', color:'white'}}>حفظ الكل</button>
        </div>
      </aside>
      <main style={{flex:1, padding:'40px'}}>
        <div style={{backgroundColor:'#2b2d31', padding:'30px', borderRadius:'10px'}}>
          {tab === 'general' && (
            <div>
              <h3>👋 الترحيب واليوتيوب</h3>
              <label>ID روم الترحيب:</label>
              <input style={inputStyle} value={settings.welcomeCh} onChange={e => setSettings({...settings, welcomeCh: e.target.value})} />
            </div>
          )}
          {tab === 'tickets' && (
            <div>
              <h3>🎫 نظام التذاكر</h3>
              <label>الأقسام (قسم1, قسم2):</label>
              <input style={inputStyle} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} />
            </div>
          )}
          {tab === 'security' && (
            <div style={{display:'flex', gap:'10px'}}>
              <input type="checkbox" checked={settings.antiLink} onChange={e => setSettings({...settings, antiLink: e.target.checked})} />
              <span>تفعيل مانع الروابط</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
const btnStyle = { padding:'12px', background:'none', border:'none', color:'#949ba4', textAlign:'right', cursor:'pointer', borderRadius:'5px' };
const inputStyle = { width:'100%', padding:'10px', margin:'10px 0', backgroundColor:'#1e1f22', border:'none', color:'white', borderRadius:'5px' };
