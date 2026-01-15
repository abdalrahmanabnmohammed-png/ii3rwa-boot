import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import EmbedMessages from './embeds';

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('tickets');
  const [settings, setSettings] = useState({ antiLink: false, infoTitle: '', ticketReasons: '', ticketSupportRole: '', youtubeChannel: '' });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => data && setSettings({...data, ticketReasons: data.ticketReasons?.join(', ') || ''}));
  }, []);

  const save = async () => {
    const reasons = settings.ticketReasons.split(',').map(r => r.trim()).filter(r => r !== "");
    await fetch('/api/settings', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...settings, ticketReasons: reasons}) });
    alert('✅ تم حفظ كافة الإعدادات بنجاح!');
  };

  if (!session) return <div style={{color:'white', textAlign:'center', padding:'50px'}}>جاري التحميل...</div>;

  return (
    <div style={{display:'flex', height:'100vh', backgroundColor:'#1e1f22', direction:'rtl'}}>
      <aside style={{width:'260px', backgroundColor:'#2b2d31', borderLeft:'1px solid #1e1f22'}}>
        <div style={{padding:'20px', fontWeight:'bold', color:'white', textAlign:'center'}}>ii3RwA Panel</div>
        <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? activeStyle : btnStyle}>🎫 التذاكر</button>
        <button onClick={() => setActiveTab('embeds')} style={activeTab === 'embeds' ? activeStyle : btnStyle}>📄 رسائل الإيمبد</button>
        <button onClick={() => setActiveTab('security')} style={activeTab === 'security' ? activeStyle : btnStyle}>🛡️ الحماية</button>
        <button onClick={save} style={{width:'80%', margin:'20px 10px', padding:'10px', backgroundColor:'#23a559', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>حفظ الإعدادات</button>
      </aside>
      <main style={{flex:1, backgroundColor:'#313338', padding:'40px', overflowY:'auto', color:'white'}}>
        <div style={{backgroundColor:'#2b2d31', padding:'30px', borderRadius:'10px'}}>
           {activeTab === 'tickets' && (
             <div>
                <h3>🎫 إعدادات التذاكر</h3>
                <label>عنوان الإيمبد:</label>
                <input style={inputStyle} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} />
                <label>الأقسام (فاصلة بين كل قسم):</label>
                <input style={inputStyle} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} />
             </div>
           )}
           {activeTab === 'embeds' && <EmbedMessages />}
           {activeTab === 'security' && (
             <div>
                <h3>🛡️ إعدادات الحماية</h3>
                <div style={{display:'flex', gap:'10px', margin:'20px 0'}}>
                   <input type="checkbox" checked={settings.antiLink} onChange={e => setSettings({...settings, antiLink: e.target.checked})} />
                   <span>تفعيل مانع الروابط</span>
                </div>
                <label>ID روم اليوتيوب:</label>
                <input style={inputStyle} value={settings.youtubeChannel} onChange={e => setSettings({...settings, youtubeChannel: e.target.value})} />
             </div>
           )}
        </div>
      </main>
    </div>
  );
}

const btnStyle = { width:'100%', padding:'15px', background:'none', border:'none', color:'#949ba4', textAlign:'right', cursor:'pointer' };
const activeStyle = { ...btnStyle, backgroundColor:'#3f4147', color:'white' };
const inputStyle = { width:'100%', padding:'10px', margin:'10px 0 20px 0', backgroundColor:'#1e1f22', border:'none', color:'white', borderRadius:'5px' };
