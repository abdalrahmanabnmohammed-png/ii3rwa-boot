import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  // إعدادات البيانات
  const [settings, setSettings] = useState({
    youtubeId: '',
    antiLinks: false,
    welcomeMsg: 'أهلاً بك في سيرفرنا!',
    welcomeChannel: '',
    logChannel: ''
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push('/');
    
    // جلب البيانات عند التحميل
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if(data) setSettings({
          youtubeId: data.youtubeChannelId || '',
          antiLinks: data.antiLinks || false,
          welcomeMsg: data.welcomeMsg || 'أهلاً بك في سيرفرنا!',
          welcomeChannel: data.welcomeChannel || '',
          logChannel: data.logChannel || ''
        });
      });
  }, [status]);

  const saveAll = async () => {
    setLoading(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    setLoading(false);
    alert('✅ تم حفظ كافة الإعدادات بنجاح في قاعدة البيانات!');
  };

  if (status === "loading") return <div style={styles.loader}>جاري التحميل...</div>;

  return (
    <div style={styles.container}>
      {/* القائمة الجانبية - Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>ii3rwa Premium</h2>
        <div style={styles.userInfo}>
          <img src={session?.user?.image} style={styles.avatar} />
          <span>{session?.user?.name}</span>
        </div>
        <nav style={styles.nav}>
          <button onClick={() => setActiveTab('general')} style={activeTab === 'general' ? styles.activeBtn : styles.navBtn}>⚙️ الإعدادات العامة</button>
          <button onClick={() => setActiveTab('protection')} style={activeTab === 'protection' ? styles.activeBtn : styles.navBtn}>🛡️ نظام الحماية</button>
          <button onClick={() => setActiveTab('welcome')} style={activeTab === 'welcome' ? styles.activeBtn : styles.navBtn}>👋 الترحيب والمغادرة</button>
          <button onClick={() => setActiveTab('youtube')} style={activeTab === 'youtube' ? styles.activeBtn : styles.navBtn}>📺 إشعارات اليوتيوب</button>
        </nav>
        <button onClick={() => signOut()} style={styles.logoutBtn}>تسجيل الخروج</button>
      </div>

      {/* المحتوى الرئيسي - Main Content */}
      <div style={styles.main}>
        <header style={styles.header}>
          <h1>{activeTab.toUpperCase()} SETTINGS</h1>
          <button onClick={saveAll} style={styles.saveBtn}>{loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</button>
        </header>

        <div style={styles.card}>
          {activeTab === 'general' && (
            <div>
              <h3>إعدادات السيرفر الأساسية</h3>
              <label>روم السجلات (Logs Channel ID):</label>
              <input type="text" value={settings.logChannel} onChange={(e) => setSettings({...settings, logChannel: e.target.value})} style={styles.input} />
            </div>
          )}

          {activeTab === 'protection' && (
            <div>
              <h3>نظام الحماية (Auto-Mod)</h3>
              <div style={styles.switchRow}>
                <span>تفعيل منع الروابط (Anti-Links)</span>
                <input type="checkbox" checked={settings.antiLinks} onChange={(e) => setSettings({...settings, antiLinks: e.target.checked})} />
              </div>
            </div>
          )}

          {activeTab === 'welcome' && (
            <div>
              <h3>نظام الترحيب</h3>
              <label>رسالة الترحيب:</label>
              <textarea value={settings.welcomeMsg} onChange={(e) => setSettings({...settings, welcomeMsg: e.target.value})} style={styles.textarea} />
              <label>ID روم الترحيب:</label>
              <input type="text" value={settings.welcomeChannel} onChange={(e) => setSettings({...settings, welcomeChannel: e.target.value})} style={styles.input} />
            </div>
          )}

          {activeTab === 'youtube' && (
            <div>
              <h3>تنبيهات اليوتيوب</h3>
              <label>معرف قناة اليوتيوب (Channel ID):</label>
              <input type="text" value={settings.youtubeId} onChange={(e) => setSettings({...settings, youtubeId: e.target.value})} style={styles.input} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// التنسيقات (Styles)
const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#36393f', color: 'white', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#2f3136', padding: '20px', display: 'flex', flexDirection: 'column' },
  logo: { textAlign: 'center', color: '#5865F2', marginBottom: '30px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', padding: '10px', backgroundColor: '#202225', borderRadius: '8px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%' },
  nav: { flex: 1 },
  navBtn: { width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none', color: '#b9bbbe', cursor: 'pointer', borderRadius: '5px', marginBottom: '5px' },
  activeBtn: { width: '100%', padding: '12px', textAlign: 'left', backgroundColor: '#4f545c', border: 'none', color: 'white', borderRadius: '5px', marginBottom: '5px' },
  logoutBtn: { padding: '10px', backgroundColor: '#ed4245', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  main: { flex: 1, padding: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  saveBtn: { padding: '10px 25px', backgroundColor: '#3ba55d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  card: { backgroundColor: '#2f3136', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
  input: { width: '100%', padding: '12px', marginTop: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #202225', backgroundColor: '#40444b', color: 'white' },
  textarea: { width: '100%', padding: '12px', marginTop: '10px', height: '100px', backgroundColor: '#40444b', color: 'white', borderRadius: '5px' },
  switchRow: { display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #40444b' },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#36393f', color: 'white' }
};
