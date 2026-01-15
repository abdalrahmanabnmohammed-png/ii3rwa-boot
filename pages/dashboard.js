import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [tab, setTab] = useState('tickets');
  const [settings, setSettings] = useState({
    infoTitle: '', infoDescription: '', infoImage: '', ticketReasons: '', ticketCategory: '', ticketSupportRole: '', logChannel: '',
    antiLink: false, youtubeChannel: '', msgWelcome: '', msgClaim: '', msgUnclaim: ''
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) setSettings({ ...data, ticketReasons: data.ticketReasons?.join(', ') || '' });
    });
  }, []);

  const save = async () => {
    const reasons = settings.ticketReasons.split(',').map(r => r.trim()).filter(r => r !== "");
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, ticketReasons: reasons }),
    });
    alert('✅ تم حفظ كافة الإعدادات بنجاح!');
  };

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>جاري تحميل اللوحة...</div>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>ii3RwA Panel</div>
        <button onClick={() => setTab('tickets')} style={tab === 'tickets' ? styles.activeNav : styles.navBtn}>🎫 نظام التذاكر</button>
        <button onClick={() => setTab('security')} style={tab === 'security' ? styles.activeNav : styles.navBtn}>🛡️ الحماية والقديم</button>
        <button onClick={save} style={styles.saveBtn}>حفظ الإعدادات</button>
      </aside>

      <main style={styles.main}>
        <div style={styles.card}>
          {tab === 'tickets' && (
            <div>
              <h3>🎫 إعدادات التذاكر</h3>
              <label style={styles.label}>عنوان الإيمبد:</label>
              <input style={styles.input} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} />
              <label style={styles.label}>رسالة الترحيب داخل التكت:</label>
              <textarea style={styles.input} value={settings.msgWelcome} onChange={e => setSettings({...settings, msgWelcome: e.target.value})} />
              <label style={styles.label}>الأقسام (فاصلة ,):</label>
              <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} />
              <label style={styles.label}>ID رتبة الدعم:</label>
              <input style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})} />
            </div>
          )}

          {tab === 'security' && (
            <div>
              <h3>🛡️ الميزات المدمجة (القديم)</h3>
              <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}>
                <input type="checkbox" checked={settings.antiLink} onChange={e => setSettings({...settings, antiLink: e.target.checked})} />
                <span>تفعيل مانع الروابط (Anti-Link)</span>
              </div>
              <label style={styles.label}>ID روم اليوتيوب:</label>
              <input style={styles.input} value={settings.youtubeChannel} onChange={e => setSettings({...settings, youtubeChannel: e.target.value})} />
              <label style={styles.label}>ID فئة التذاكر:</label>
              <input style={styles.input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#0f1011', color: 'white', direction: 'rtl' },
  sidebar: { width: '250px', backgroundColor: '#18191c', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #232428' },
  brand: { padding: '25px', fontSize: '20px', fontWeight: 'bold', color: '#5865f2', textAlign: 'center' },
  main: { flex: 1, padding: '40px' },
  navBtn: { width: '100%', padding: '15px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer' },
  activeNav: { width: '100%', padding: '15px', backgroundColor: '#35373c', color: 'white', textAlign: 'right', fontWeight: 'bold' },
  saveBtn: { margin: '20px', padding: '15px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '10px' },
  label: { display: 'block', fontSize: '13px', color: '#b5bac1', marginBottom: '5px' },
  input: { width: '100%', padding: '12px', margin: '5px 0 20px 0', backgroundColor: '#1e1f22', border: 'none', color: 'white', borderRadius: '5px' }
};
