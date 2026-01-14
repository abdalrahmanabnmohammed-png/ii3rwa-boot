import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    youtubeChannelId: '', 
    antiLinks: false, 
    welcomeMsg: '', 
    welcomeChannel: '', 
    logChannel: '',
    banShortcut: '#حظر', 
    kickShortcut: '#طرد', 
    clearShortcut: '#مسح',
    enableBan: true, 
    enableKick: true, 
    enableClear: true
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) setSettings(prev => ({ ...prev, ...data }));
      });
  }, []);

  const save = async () => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) alert('✅ تم حفظ كافة الإعدادات وتفعيل الأنظمة بنجاح!');
  };

  if (status === "loading") return <div style={styles.loading}>جاري تحميل لوحة التحكم...</div>;

  return (
    <div style={styles.container}>
      {/* القائمة الجانبية */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>ii3rwa Premium</h2>
        <div style={styles.nav}>
          <button onClick={() => setActiveTab('general')} style={activeTab === 'general' ? styles.activeBtn : styles.navBtn}>⚙️ الإعدادات العامة</button>
          <button onClick={() => setActiveTab('protection')} style={activeTab === 'protection' ? styles.activeBtn : styles.navBtn}>🛡️ الحماية والروابط</button>
          <button onClick={() => setActiveTab('shortcuts')} style={activeTab === 'shortcuts' ? styles.activeBtn : styles.navBtn}>⌨️ اختصارات الأوامر</button>
          <button onClick={() => setActiveTab('welcome')} style={activeTab === 'welcome' ? styles.activeBtn : styles.navBtn}>👋 الترحيب والمغادرة</button>
        </div>
        <button onClick={() => signOut()} style={styles.logoutBtn}>تسجيل الخروج</button>
      </div>

      {/* المحتوى الرئيسي */}
      <div style={styles.main}>
        <div style={styles.header}>
          <h1>لوحة التحكم الشاملة</h1>
          <button onClick={save} style={styles.saveBtn}>حفظ كافة التغييرات</button>
        </div>

        <div style={styles.card}>
          {activeTab === 'general' && (
            <div>
              <h3>📺 إعدادات اليوتيوب والسجلات</h3>
              <label>معرف قناة اليوتيوب (Channel ID):</label>
              <input style={styles.input} value={settings.youtubeChannelId} onChange={e => setSettings({...settings, youtubeChannelId: e.target.value})} placeholder="UCxxxxxxxxxxxx" />
              <label>ID روم السجلات (Logs):</label>
              <input style={styles.input} value={settings.logChannel} onChange={e => setSettings({...settings, logChannel: e.target.value})} placeholder="1234567890" />
            </div>
          )}

          {activeTab === 'protection' && (
            <div>
              <h3>🛡️ نظام الحماية التلقائي</h3>
              <div style={styles.switchRow}>
                <span>تفعيل منع الروابط (Anti-Links)</span>
                <input type="checkbox" checked={settings.antiLinks} onChange={e => setSettings({...settings, antiLinks: e.target.checked})} />
              </div>
              <p style={{fontSize: '12px', color: '#b9bbbe'}}>* ملاحظة: الإدارة مستثناة من منع الروابط تلقائياً.</p>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div style={styles.grid}>
              <div style={styles.subCard}>
                <h4>🚫 أمر الحظر</h4>
                <input style={styles.input} value={settings.banShortcut} onChange={e => setSettings({...settings, banShortcut: e.target.value})} placeholder="مثال: #حظر" />
                <label><input type="checkbox" checked={settings.enableBan} onChange={e => setSettings({...settings, enableBan: e.target.checked})} /> تفعيل</label>
              </div>
              <div style={styles.subCard}>
                <h4>🧹 أمر المسح</h4>
                <input style={styles.input} value={settings.clearShortcut} onChange={e => setSettings({...settings, clearShortcut: e.target.value})} placeholder="مثال: #مسح" />
                <label><input type="checkbox" checked={settings.enableClear} onChange={e => setSettings({...settings, enableClear: e.target.checked})} /> تفعيل</label>
              </div>
            </div>
          )}

          {activeTab === 'welcome' && (
            <div>
              <h3>👋 نظام الترحيب</h3>
              <label>رسالة الترحيب (استخدم [user] للمنشن):</label>
              <textarea style={styles.textarea} value={settings.welcomeMsg} onChange={e => setSettings({...settings, welcomeMsg: e.target.value})} />
              <label>ID روم الترحيب:</label>
              <input style={styles.input} value={settings.welcomeChannel} onChange={e => setSettings({...settings, welcomeChannel: e.target.value})} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#36393f', color: 'white', fontFamily: 'Segoe UI, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#2f3136', padding: '20px', display: 'flex', flexDirection: 'column' },
  logo: { color: '#5865F2', textAlign: 'center', marginBottom: '30px' },
  nav: { flex: 1 },
  navBtn: { width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none', color: '#b9bbbe', cursor: 'pointer', borderRadius: '5px', marginBottom: '5px' },
  activeBtn: { width: '100%', padding: '12px', textAlign: 'left', backgroundColor: '#4f545c', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '5px' },
  logoutBtn: { padding: '10px', backgroundColor: '#ed4245', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  main: { flex: 1, padding: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  saveBtn: { padding: '12px 25px', backgroundColor: '#3ba55d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  card: { backgroundColor: '#2f3136', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
  input: { width: '100%', padding: '12px', marginTop: '8px', marginBottom: '20px', backgroundColor: '#40444b', color: 'white', border: 'none', borderRadius: '5px' },
  textarea: { width: '100%', padding: '12px', height: '100px', backgroundColor: '#40444b', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '20px' },
  switchRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#40444b', borderRadius: '5px', marginBottom: '10px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  subCard: { backgroundColor: '#40444b', padding: '15px', borderRadius: '8px' },
  loading: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#36393f', color: 'white' }
};
