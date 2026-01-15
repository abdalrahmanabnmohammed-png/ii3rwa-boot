import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState({
    youtubeChannelId: '', antiLinks: false, welcomeMsg: '', welcomeChannel: '', logChannel: '',
    banShortcut: '#حظر', clearShortcut: '#مسح'
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

  if (!session) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1f22', color: 'white', fontFamily: 'Arial' }}>
      <div style={{ width: '260px', backgroundColor: '#2b2d31', padding: '20px' }}>
        <h3 style={{ color: '#5865f2' }}>Pro Dashboard</h3>
        <p style={groupTitle}>عام</p>
        <button onClick={() => setActiveTab('overview')} style={activeTab === 'overview' ? activeBtn : navBtn}>👁️ نظرة عامة</button>
        <p style={groupTitle}>الخصائص</p>
        <button onClick={() => setActiveTab('welcome')} style={activeTab === 'welcome' ? activeBtn : navBtn}>✋ الترحيب والمغادرة</button>
        <button onClick={() => setActiveTab('levels')} style={activeTab === 'levels' ? activeBtn : navBtn}>📊 نظام اللفلات</button>
        <button onClick={() => setActiveTab('protection')} style={activeTab === 'protection' ? activeBtn : navBtn}>🛡️ الرقابة</button>
        <button onClick={() => signOut()} style={{ ...navBtn, color: '#ed4245', marginTop: '20px' }}>🚪 خروج</button>
      </div>

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>{activeTab.toUpperCase()}</h2>
          <button onClick={save} style={saveBtn}>حفظ التغييرات</button>
        </div>

        {activeTab === 'welcome' && (
          <div style={card}>
            <h3>👋 إعدادات الترحيب (الصورة مفعلة تلقائياً)</h3>
            <label>ID روم الترحيب:</label>
            <input style={input} value={settings.welcomeChannel} onChange={e => setSettings({...settings, welcomeChannel: e.target.value})} placeholder="رقم الروم هنا" />
            <div style={{marginTop:'20px'}}>
              <label>رسالة الترحيب (نصية بجانب الصورة):</label>
              <textarea style={{...input, height:'80px'}} value={settings.welcomeMsg} onChange={e => setSettings({...settings, welcomeMsg: e.target.value})} placeholder="أهلاً بك [user]..." />
            </div>
          </div>
        )}

        {/* باقي التبويبات تظل كما هي في النسخة السابقة */}
      </div>
    </div>
  );
}

const groupTitle = { fontSize: '12px', color: '#949ba4', marginBottom: '10px', marginTop: '20px' };
const navBtn = { width: '100%', padding: '10px', textAlign: 'left', background: 'none', border: 'none', color: '#b9bbbe', cursor: 'pointer' };
const activeBtn = { ...navBtn, backgroundColor: '#3f4147', color: 'white', borderRadius: '5px' };
const saveBtn = { backgroundColor: '#5865f2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };
const card = { backgroundColor: '#2b2d31', padding: '20px', borderRadius: '8px' };
const input = { width: '100%', padding: '10px', backgroundColor: '#1e1f22', border: 'none', color: 'white', marginTop: '5px' };
