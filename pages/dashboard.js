import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';

// استيراد صفحة النظرة العامة بشكل ديناميكي لحل مشاكل الـ Build في Vercel
const Overview = dynamic(() => import('./overview'), { ssr: false });

export default function ProDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    antiLink: false, youtubeChannel: '', welcomeChannel: '',
    infoTitle: '', infoDescription: '', ticketReasons: '',
    ticketCategory: '', ticketSupportRole: '', logChannel: '',
    msgWelcome: '', msgClaim: '', msgUnclaim: ''
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) setSettings({ ...data, ticketReasons: data.ticketReasons?.join(', ') || '' });
    });
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    const reasons = settings.ticketReasons.split(',').map(r => r.trim()).filter(r => r !== "");
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, ticketReasons: reasons }),
    });
    setIsSaving(false);
    alert('✅ تم الحفظ بنجاح');
  };

  if (!session) return <div style={{color:'white', padding:'50px', textAlign:'center'}}>جاري التحميل...</div>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>ii3RwA Control</div>
        <nav style={styles.nav}>
          <button onClick={() => setActiveTab('overview')} style={activeTab === 'overview' ? styles.activeNav : styles.navBtn}>👁️ نظرة عامة</button>
          <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? styles.activeNav : styles.navBtn}>🎫 التذاكر</button>
          <button onClick={() => setActiveTab('security')} style={activeTab === 'security' ? styles.activeNav : styles.navBtn}>🛡️ الحماية</button>
        </nav>
        <button onClick={saveSettings} style={styles.saveBtn} disabled={isSaving}>{isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</button>
      </aside>

      <main style={styles.main}>
        {activeTab === 'overview' ? <Overview /> : (
          <div style={styles.card}>
            {activeTab === 'tickets' ? (
              <>
                <h3>🎫 إعدادات التذاكر</h3>
                <label style={styles.label}>عنوان الإيمبد</label>
                <input style={styles.input} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} />
                <label style={styles.label}>الأقسام (فاصلة ,)</label>
                <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} />
              </>
            ) : (
              <>
                <h3>🛡️ الحماية</h3>
                <div style={styles.switchRow}>
                  <span>تفعيل مانع الروابط</span>
                  <input type="checkbox" checked={settings.antiLink} onChange={e => setSettings({...settings, antiLink: e.target.checked})} />
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#0f1011', color: 'white', direction: 'rtl' },
  sidebar: { width: '250px', backgroundColor: '#18191c', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #232428' },
  brand: { padding: '25px', fontSize: '20px', fontWeight: 'bold', color: '#5865f2', textAlign: 'center' },
  nav: { flex: 1, padding: '10px' },
  navBtn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer', borderRadius: '5px' },
  activeNav: { width: '100%', padding: '12px', backgroundColor: '#35373c', color: 'white', textAlign: 'right', borderRadius: '5px', fontWeight: 'bold' },
  main: { flex: 1, padding: '30px', overflowY: 'auto' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '10px' },
  input: { width: '100%', padding: '12px', margin: '10px 0', backgroundColor: '#1e1f22', border: 'none', color: 'white', borderRadius: '5px' },
  label: { fontSize: '13px', color: '#b5bac1' },
  switchRow: { display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#1e1f22', borderRadius: '5px' },
  saveBtn: { margin: '20px', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};
