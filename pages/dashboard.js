import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('info');
  const [settings, setSettings] = useState({
    infoTitle: '', infoDescription: '', infoImage: '', ticketCategory: '', ticketSupportRole: '', ticketReasons: '', logChannel: '',
    msgWelcome: '', msgClaim: '', msgUnclaim: '', msgClose: ''
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
    alert('✅ تم حفظ جميع الرسائل والإعدادات!');
  };

  if (!session) return null;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={{color:'#5865f2'}}>لوحة التحكم</h2>
        <button onClick={() => setActiveTab('info')} style={activeTab === 'info' ? styles.activeNav : styles.navBtn}>📝 الرسائل</button>
        <button onClick={() => setActiveTab('ids')} style={activeTab === 'ids' ? styles.activeNav : styles.navBtn}>🆔 المعرفات (IDs)</button>
        <button onClick={save} style={styles.saveBtn}>حفظ الإعدادات</button>
      </aside>

      <main style={styles.content}>
        {activeTab === 'info' && (
          <div style={styles.card}>
            <h3>📝 تخصيص رسائل البوت</h3>
            <p style={{fontSize:'12px', color:'#aaa'}}>المتغيرات المتاحة: {'{user}'} منشن العضو، {'{admin}'} منشن الإداري، {'{reason}'} القسم</p>
            
            <label style={styles.label}>رسالة الترحيب (عند فتح التكت):</label>
            <textarea style={styles.input} value={settings.msgWelcome} onChange={e => setSettings({...settings, msgWelcome: e.target.value})} />

            <label style={styles.label}>رسالة استلام التكت:</label>
            <textarea style={styles.input} value={settings.msgClaim} onChange={e => setSettings({...settings, msgClaim: e.target.value})} />

            <label style={styles.label}>رسالة ترك التكت:</label>
            <textarea style={styles.input} value={settings.msgUnclaim} onChange={e => setSettings({...settings, msgUnclaim: e.target.value})} />

            <label style={styles.label}>رسالة تأكيد الإغلاق:</label>
            <input style={styles.input} value={settings.msgClose} onChange={e => setSettings({...settings, msgClose: e.target.value})} />
          </div>
        )}

        {activeTab === 'ids' && (
          <div style={styles.card}>
            <h3>🆔 إعدادات المعرفات</h3>
            <label style={styles.label}>ID فئة التذاكر:</label>
            <input style={styles.input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})} />
            <label style={styles.label}>ID رتبة الدعم:</label>
            <input style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})} />
            <label style={styles.label}>ID روم السجلات:</label>
            <input style={styles.input} value={settings.logChannel} onChange={e => setSettings({...settings, logChannel: e.target.value})} />
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#1e1f22', color: 'white', direction: 'rtl' },
  sidebar: { width: '250px', backgroundColor: '#2b2d31', padding: '20px' },
  content: { flex: 1, padding: '40px', overflowY: 'auto' },
  navBtn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#b9bbbe', textAlign: 'right', cursor: 'pointer' },
  activeNav: { width: '100%', padding: '12px', backgroundColor: '#3f4147', color: 'white', borderRadius: '5px', textAlign: 'right' },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', fontWeight: 'bold', cursor:'pointer' },
  card: { backgroundColor: '#2b2d31', padding: '25px', borderRadius: '10px' },
  label: { display: 'block', marginTop: '10px', fontSize: '14px' },
  input: { width: '100%', padding: '10px', margin: '5px 0 15px 0', backgroundColor: '#1e1f22', color: 'white', border: 'none', borderRadius: '5px' }
};
