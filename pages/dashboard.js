import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    youtubeChannelId: '', antiLinks: false, welcomeMsg: '', welcomeChannel: '', logChannel: '', customCommands: []
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => data && setSettings(data));
  }, []);

  const addCommand = () => {
    setSettings({...settings, customCommands: [...settings.customCommands, { trigger: '', response: '' }]});
  };

  const updateCommand = (index, field, value) => {
    const newCmds = [...settings.customCommands];
    newCmds[index][field] = value;
    setSettings({...settings, customCommands: newCmds});
  };

  const removeCommand = (index) => {
    const newCmds = settings.customCommands.filter((_, i) => i !== index);
    setSettings({...settings, customCommands: newCmds});
  };

  const save = () => {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).then(() => alert('✅ تم الحفظ بنجاح!'));
  };

  if (!session) return <div style={{backgroundColor:'#36393f', height:'100vh'}}></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#36393f', color: 'white', fontFamily: 'Arial' }}>
      <div style={{ width: '250px', backgroundColor: '#2f3136', padding: '20px' }}>
        <h2 style={{color:'#5865F2'}}>ii3rwa Control</h2>
        <button onClick={() => setActiveTab('general')} style={navBtn}>⚙️ الإعدادات</button>
        <button onClick={() => setActiveTab('custom')} style={navBtn}>⌨️ أوامر مخصصة</button>
        <button onClick={save} style={{...navBtn, backgroundColor:'#3ba55d', color:'white', marginTop:'20px'}}>حفظ التغييرات</button>
      </div>

      <div style={{ flex: 1, padding: '40px' }}>
        {activeTab === 'general' && (
          <div style={cardStyle}>
            <h3>إعدادات القنوات</h3>
            <label>ID قناة اليوتيوب:</label>
            <input style={inputStyle} value={settings.youtubeChannelId} onChange={e => setSettings({...settings, youtubeChannelId: e.target.value})} />
            <label>ID روم السجلات:</label>
            <input style={inputStyle} value={settings.logChannel} onChange={e => setSettings({...settings, logChannel: e.target.value})} />
          </div>
        )}

        {activeTab === 'custom' && (
          <div>
            <h3>الأوامر المخصصة (Auto-Response)</h3>
            {settings.customCommands.map((cmd, index) => (
              <div key={index} style={{...cardStyle, marginBottom:'10px', display:'flex', gap:'10px', alignItems:'center'}}>
                <input placeholder="الأمر (مثلاً rules)" style={inputStyle} value={cmd.trigger} onChange={e => updateCommand(index, 'trigger', e.target.value)} />
                <input placeholder="الرد" style={inputStyle} value={cmd.response} onChange={e => updateCommand(index, 'response', e.target.value)} />
                <button onClick={() => removeCommand(index)} style={{backgroundColor:'#ed4245', border:'none', color:'white', padding:'10px', borderRadius:'5px', cursor:'pointer'}}>حذف</button>
              </div>
            ))}
            <button onClick={addCommand} style={{padding:'10px', backgroundColor:'#5865F2', border:'none', color:'white', borderRadius:'5px', cursor:'pointer'}}>+ إضافة أمر جديد</button>
          </div>
        )}
      </div>
    </div>
  );
}

const navBtn = { width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none', color: '#b9bbbe', cursor: 'pointer', borderRadius: '5px' };
const cardStyle = { backgroundColor: '#2f3136', padding: '20px', borderRadius: '10px' };
const inputStyle = { flex: 1, padding: '10px', backgroundColor: '#40444b', color: 'white', border: 'none', borderRadius: '5px' };
