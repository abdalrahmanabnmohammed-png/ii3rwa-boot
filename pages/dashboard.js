import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    youtubeChannelId: '', antiLinks: false, welcomeMsg: '', welcomeChannel: '', logChannel: '',
    enableBan: true, enableKick: true, enableClear: true // حالات الأوامر
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => data && setSettings(data));
  }, []);

  const save = () => {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).then(() => alert('✅ تم حفظ التغييرات بنجاح!'));
  };

  if (!session) return <div style={styles.loading}>جاري التحميل...</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>ii3rwa Premium</h2>
        <button onClick={() => setActiveTab('general')} style={activeTab === 'general' ? styles.activeBtn : styles.navBtn}>⚙️ الإعدادات العامة</button>
        <button onClick={() => setActiveTab('commands')} style={activeTab === 'commands' ? styles.activeBtn : styles.navBtn}>⌨️ الأوامر الإدارية</button>
        <button onClick={() => setActiveTab('welcome')} style={activeTab === 'welcome' ? styles.activeBtn : styles.navBtn}>👋 الترحيب</button>
        <button onClick={() => signOut()} style={styles.logoutBtn}>تسجيل الخروج</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.header}>
          <h1>{activeTab === 'commands' ? 'الأوامر الإدارية' : 'إعدادات البوت'}</h1>
          <button onClick={save} style={styles.saveBtn}>حفظ التغييرات</button>
        </div>

        {activeTab === 'general' && (
          <div style={styles.card}>
            <h3>إعدادات القنوات</h3>
            <label>ID قناة اليوتيوب:</label>
            <input style={styles.input} value={settings.youtubeChannelId} onChange={e => setSettings({...settings, youtubeChannelId: e.target.value})} />
            <label>ID روم السجلات (Logs):</label>
            <input style={styles.input} value={settings.logChannel} onChange={e => setSettings({...settings, logChannel: e.target.value})} />
          </div>
        )}

        {activeTab === 'commands' && (
          <div style={styles.commandsGrid}>
            {/* بطاقة أمر Clear */}
            <div style={styles.commandCard}>
              <div style={styles.cmdHeader}>
                <span>🧹 أمر المسح (Clear)</span>
                <input type="checkbox" checked={settings.enableClear} onChange={e => setSettings({...settings, enableClear: e.target.checked})} />
              </div>
              <p style={styles.cmdDesc}>يمسح عدد معين من الرسائل. الاستخدام: `!clear 10`</p>
            </div>

            {/* بطاقة أمر Ban */}
            <div style={styles.commandCard}>
              <div style={styles.cmdHeader}>
                <span>🚫 أمر الحظر (Ban)</span>
                <input type="checkbox" checked={settings.enableBan} onChange={e => setSettings({...settings, enableBan: e.target.checked})} />
              </div>
              <p style={styles.cmdDesc}>حظر عضو من السيرفر نهائياً. الاستخدام: `!ban @user`</p>
            </div>

            {/* بطاقة أمر Kick */}
            <div style={styles.commandCard}>
              <div style={styles.cmdHeader}>
                <span>👞 أمر الطرد (Kick)</span>
                <input type="checkbox" checked={settings.enableKick} onChange={e => setSettings({...settings, enableKick: e.target.checked})} />
              </div>
              <p style={styles.cmdDesc}>طرد عضو من السيرفر. الاستخدام: `!kick @user`</p>
            </div>
          </div>
        )}

        {activeTab === 'welcome' && (
          <div style={styles.card}>
            <h3>نظام الترحيب</h3>
            <label>رسالة الترحيب:</label>
            <textarea style={styles.textarea} value={settings.welcomeMsg} onChange={e => setSettings({...settings, welcomeMsg: e.target.value})} />
            <label>ID روم الترحيب:</label>
            <input style={styles.input} value={settings.welcomeChannel} onChange={e => setSettings({...settings, welcomeChannel: e.target.value})} />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#36393f', color: 'white', fontFamily: 'Arial' },
  sidebar: { width: '250px', backgroundColor: '#2f3136', padding: '20px' },
  logo: { color: '#5865F2', marginBottom: '30px', textAlign: 'center' },
  navBtn: { width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none', color: '#b9bbbe', cursor: 'pointer', borderRadius: '5px' },
  activeBtn: { width: '100%', padding: '12px', textAlign: 'left', backgroundColor: '#4f545c', border: 'none', color: 'white', borderRadius: '5px' },
  logoutBtn: { width: '100%', marginTop: '40px', padding: '10px', backgroundColor: '#ed4245', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  main: { flex: 1, padding: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  saveBtn: { padding: '10px 25px', backgroundColor: '#3ba55d', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  card: { backgroundColor: '#2f3136', padding: '20px', borderRadius: '8px' },
  input: { width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#40444b', color: 'white', border: 'none', borderRadius: '5px' },
  textarea: { width: '100%', padding: '10px', height: '80px', backgroundColor: '#40444b', color: 'white', border: 'none', borderRadius: '5px' },
  commandsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  commandCard: { backgroundColor: '#2f3136', padding: '20px', borderRadius: '10px', border: '1px solid #202225' },
  cmdHeader: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '10px' },
  cmdDesc: { fontSize: '14px', color: '#b9bbbe' },
  loading: { backgroundColor: '#36393f', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};
