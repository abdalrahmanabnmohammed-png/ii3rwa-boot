import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    youtubeChannelId: '', antiLinks: false, welcomeMsg: '', welcomeChannel: '', logChannel: '', cmdTrigger: '', cmdResponse: ''
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => data && setSettings(data));
  }, []);

  const save = () => {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).then(() => alert('✅ تم حفظ كافة الإعدادات بنجاح!'));
  };

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>جاري التحميل...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#36393f', color: 'white', fontFamily: 'Arial' }}>
      <div style={{ width: '250px', backgroundColor: '#2f3136', padding: '20px' }}>
        <h2 style={{color: '#5865F2'}}>ii3rwa Premium</h2>
        <button onClick={() => setActiveTab('general')} style={btnStyle}>⚙️ الإعدادات</button>
        <button onClick={() => setActiveTab('welcome')} style={btnStyle}>👋 الترحيب</button>
        <button onClick={() => setActiveTab('protection')} style={btnStyle}>🛡️ الحماية</button>
        <button onClick={() => setActiveTab('commands')} style={btnStyle}>⌨️ الأوامر</button>
        <button onClick={() => signOut()} style={{...btnStyle, color:'#ed4245', marginTop:'20px'}}>تسجيل خروج</button>
      </div>
      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{ backgroundColor: '#2f3136', padding: '20px', borderRadius: '10px' }}>
          {activeTab === 'general' && (
            <div>
              <h3>إعدادات اليوتيوب والسجلات</h3>
              <label>ID قناة اليوتيوب:</label>
              <input style={inputStyle} value={settings.youtubeChannelId} onChange={e => setSettings({...settings, youtubeChannelId: e.target.value})} />
              <label>ID روم السجلات (Logs):</label>
              <input style={inputStyle} value={settings.logChannel} onChange={e => setSettings({...settings, logChannel: e.target.value})} />
            </div>
          )}
          {activeTab === 'welcome' && (
            <div>
              <h3>الترحيب</h3>
              <label>رسالة الترحيب (استخدم [user] للمنشن):</label>
              <textarea style={inputStyle} value={settings.welcomeMsg} onChange={e => setSettings({...settings, welcomeMsg: e.target.value})} />
              <label>ID روم الترحيب:</label>
              <input style={inputStyle} value={settings.welcomeChannel} onChange={e => setSettings({...settings, welcomeChannel: e.target.value})} />
            </div>
          )}
          {activeTab === 'protection' && (
            <div>
              <h3>نظام الحماية</h3>
              <label><input type="checkbox" checked={settings.antiLinks} onChange={e => setSettings({...settings, antiLinks: e.target.checked})} /> تفعيل منع الروابط</label>
            </div>
          )}
          {activeTab === 'commands' && (
            <div>
              <h3>أمر مخصص (اختصار)</h3>
              <label>الأمر (بدون !):</label>
              <input style={inputStyle} value={settings.cmdTrigger} onChange={e => setSettings({...settings, cmdTrigger: e.target.value})} />
              <label>رد البوت:</label>
              <textarea style={inputStyle} value={settings.cmdResponse} onChange={e => setSettings({...settings, cmdResponse: e.target.value})} />
            </div>
          )}
          <button onClick={save} style={{ width: '100%', padding: '15px', backgroundColor: '#3ba55d', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '5px', marginTop: '20px' }}>حفظ التغييرات</button>
        </div>
      </div>
    </div>
  );
}
const btnStyle = { width: '100%', padding: '10px', textAlign: 'left', background: 'none', border: 'none', color: '#b9bbbe', cursor: 'pointer', fontSize: '16px' };
const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#40444b', color: 'white', border: 'none', borderRadius: '5px' };
