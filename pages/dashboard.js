import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import EmbedMessages from './embeds';

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('embeds');
  const [settings, setSettings] = useState({ antiLink: false, infoTitle: '', ticketReasons: '', ticketSupportRole: '' });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => data && setSettings({...data, ticketReasons: data.ticketReasons?.join(', ') || ''}));
  }, []);

  if (!session) return <div style={{color:'white', textAlign:'center', padding:'50px'}}>جاري التحميل...</div>;

  return (
    <div style={{display:'flex', height:'100vh', backgroundColor:'#1e1f22', direction:'rtl'}}>
      <aside style={{width:'280px', backgroundColor:'#2b2d31', borderLeft:'1px solid #1e1f22'}}>
        <div style={{padding:'20px', fontWeight:'bold', color:'white', borderBottom:'1px solid #1e1f22'}}>ii3RwA Control</div>
        <div style={{padding:'10px'}}>
           <button onClick={() => setActiveTab('embeds')} style={activeTab === 'embeds' ? activeStyle : btnStyle}>📄 رسائل الإيمبد</button>
           <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? activeStyle : btnStyle}>🎫 التذاكر</button>
        </div>
      </aside>
      <main style={{flex:1, backgroundColor:'#313338', padding:'40px', overflowY:'auto'}}>
        {activeTab === 'embeds' ? <EmbedMessages /> : (
          <div style={{backgroundColor:'#2b2d31', padding:'30px', borderRadius:'8px'}}>
             <h3 style={{color:'white'}}>🎫 إعدادات التذاكر</h3>
             <input style={inputStyle} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} placeholder="عنوان الرسالة" />
             <input style={inputStyle} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} placeholder="الأقسام (قسم1, قسم2)" />
             <button style={{backgroundColor:'#23a559', color:'white', border:'none', padding:'10px 20px', borderRadius:'4px', cursor:'pointer'}} 
               onClick={async () => {
                 const reasons = settings.ticketReasons.split(',').map(r => r.trim());
                 await fetch('/api/settings', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...settings, ticketReasons: reasons}) });
                 alert('✅ تم الحفظ!');
               }}>حفظ التغييرات</button>
          </div>
        )}
      </main>
    </div>
  );
}

const btnStyle = { width:'100%', padding:'12px', background:'none', border:'none', color:'#949ba4', textAlign:'right', cursor:'pointer' };
const activeStyle = { ...btnStyle, backgroundColor:'#3f4147', color:'white', borderRadius:'5px' };
const inputStyle = { width:'100%', padding:'12px', backgroundColor:'#1e1f22', border:'none', color:'white', borderRadius:'5px', marginBottom:'20px' };
