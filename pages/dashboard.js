import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState({
    ticketTitle: '', ticketDescription: '', ticketColor: '#5865f2', ticketButtonText: '',
    ticketCategory: '', youtubeChannelId: '', antiLinks: false
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => data && setSettings(prev => ({...prev, ...data})));
  }, []);

  const save = () => {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).then(() => alert('✅ تم الحفظ! استخدم #setup-tickets في ديسكورد لرؤية التعديل.'));
  };

  if (!session) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1f22', color: 'white', fontFamily: 'Arial' }}>
      <div style={{ width: '260px', backgroundColor: '#2b2d31', padding: '20px' }}>
        <h3 style={{ color: '#5865f2' }}>Pro Dashboard</h3>
        <p style={groupTitle}>الخصائص</p>
        <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? activeBtn : navBtn}>🎫 نظام التذاكر</button>
        <button onClick={() => setActiveTab('protection')} style={activeTab === 'protection' ? activeBtn : navBtn}>🛡️ الرقابة</button>
        <button onClick={() => setActiveTab('levels')} style={activeTab === 'levels' ? activeBtn : navBtn}>📊 اللفلات</button>
        <button onClick={() => signOut()} style={{ ...navBtn, color: '#ed4245', marginTop: '20px' }}>🚪 خروج</button>
      </div>

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>{activeTab.toUpperCase()}</h2>
          <button onClick={save} style={saveBtn}>حفظ الإعدادات</button>
        </div>

        {activeTab === 'tickets' && (
          <div style={card}>
            <h3>تخصيص رسالة التذاكر</h3>
            <label>عنوان الإيمبد:</label>
            <input style={input} value={settings.ticketTitle} onChange={e => setSettings({...settings, ticketTitle: e.target.value})} />
            
            <label>وصف الإيمبد:</label>
            <textarea style={{...input, height:'80px'}} value={settings.ticketDescription} onChange={e => setSettings({...settings, ticketDescription: e.target.value})} />
            
            <div style={{display:'flex', gap:'20px', marginTop:'15px'}}>
               <div style={{flex:1}}>
                 <label>لون الإيمبد:</label>
                 <input style={input} type="color" value={settings.ticketColor} onChange={e => setSettings({...settings, ticketColor: e.target.value})} />
               </div>
               <div style={{flex:1}}>
                 <label>نص الزر:</label>
                 <input style={input} value={settings.ticketButtonText} onChange={e => setSettings({...settings, ticketButtonText: e.target.value})} />
               </div>
            </div>

            <label style={{marginTop:'20px', display:'block'}}>ID فئة التذاكر (Category):</label>
            <input style={input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})} />
          </div>
        )}
        
        {/* التبويبات الأخرى تظل كما في الأكواد السابقة */}
      </div>
    </div>
  );
}

const groupTitle = { fontSize: '12px', color: '#949ba4', marginBottom: '10px', marginTop: '20px' };
const navBtn = { width: '100%', padding: '10px', textAlign: 'left', background: 'none', border: 'none', color: '#b9bbbe', cursor: 'pointer' };
const activeBtn = { ...navBtn, backgroundColor: '#3f4147', color: 'white', borderRadius: '5px' };
const saveBtn = { backgroundColor: '#23a559', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight:'bold' };
const card = { backgroundColor: '#2b2d31', padding: '20px', borderRadius: '8px' };
const input = { width: '100%', padding: '12px', backgroundColor: '#1e1f22', border: 'none', color: 'white', marginTop: '8px', marginBottom: '15px', borderRadius: '5px' };
