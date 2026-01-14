import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState({
    youtubeChannelId: '', antiLinks: false, welcomeMsg: '', logChannel: '',
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
    }).then(() => alert('✅ تم الحفظ بنجاح!'));
  };

  if (!session) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1f22', color: 'white', fontFamily: 'Arial' }}>
      {/* Sidebar المطابق للصور */}
      <div style={{ width: '260px', backgroundColor: '#2b2d31', padding: '20px' }}>
        <h3 style={{ color: '#5865f2' }}>Pro Dashboard</h3>
        <div style={{ marginTop: '20px' }}>
          <p style={groupTitle}>عام</p>
          <button onClick={() => setActiveTab('overview')} style={activeTab === 'overview' ? activeBtn : navBtn}>👁️ نظرة عامة</button>
          <p style={groupTitle}>الخصائص</p>
          <button onClick={() => setActiveTab('levels')} style={activeTab === 'levels' ? activeBtn : navBtn}>📊 نظام اللفلات</button>
          <button onClick={() => setActiveTab('protection')} style={activeTab === 'protection' ? activeBtn : navBtn}>🛡️ الرقابة</button>
          <button onClick={() => signOut()} style={{ ...navBtn, color: '#ed4245' }}>🚪 خروج</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>{activeTab.toUpperCase()}</h2>
          <button onClick={save} style={saveBtn}>حفظ التغييرات</button>
        </div>

        {activeTab === 'levels' && (
          <div style={card}>
            <h3>📊 ترتيب المتفاعلين</h3>
            <div style={{ padding: '10px', backgroundColor: '#1e1f22', borderRadius: '5px' }}>
              <p>1. {session.user.name} - Level 1</p>
              <p style={{ fontSize: '12px', color: '#aaa' }}>سيتم عرض باقي الأعضاء عند تفاعلهم في السيرفر.</p>
            </div>
          </div>
        )}

        {activeTab === 'protection' && (
          <div style={card}>
            <h3>🛡️ إعدادات الحماية</h3>
            <label><input type="checkbox" checked={settings.antiLinks} onChange={e => setSettings({...settings, antiLinks: e.target.checked})} /> منع الروابط</label>
            <div style={{ marginTop: '20px' }}>
              <label>اختصار الحظر:</label>
              <input style={input} value={settings.banShortcut} onChange={e => setSettings({...settings, banShortcut: e.target.value})} />
            </div>
          </div>
        )}
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
