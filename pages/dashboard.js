import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('commands');
  const [settings, setSettings] = useState({
    banShortcut: '#حظر', kickShortcut: '#طرد', clearShortcut: '#مسح',
    enableBan: true, enableKick: true, enableClear: true
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => data && setSettings(data));
  }, []);

  const save = () => {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).then(() => alert('✅ تم حفظ التغييرات والتمكن من استخدام الاختصارات الجديدة!'));
  };

  if (!session) return <div style={{backgroundColor:'#36393f', height:'100vh'}}></div>;

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={{color: '#5865F2'}}>ii3rwa Premium</h2>
        <button onClick={() => setActiveTab('commands')} style={activeTab === 'commands' ? styles.activeBtn : styles.navBtn}>⌨️ الأوامر والاختصارات</button>
        <button onClick={save} style={styles.saveBtn}>حفظ التغييرات</button>
      </div>

      <div style={styles.main}>
        <h2 style={{marginBottom: '20px'}}>إعدادات الأوامر (مثل ProBot)</h2>
        
        <div style={styles.grid}>
          {/* إعداد أمر الحظر */}
          <div style={styles.commandCard}>
            <div style={styles.cardHeader}>
              <span>🚫 أمر الحظر (/ban)</span>
              <input type="checkbox" checked={settings.enableBan} onChange={e => setSettings({...settings, enableBan: e.target.checked})} />
            </div>
            <label style={styles.label}>الاختصار المخصص:</label>
            <input style={styles.input} value={settings.banShortcut} onChange={e => setSettings({...settings, banShortcut: e.target.value})} placeholder="مثال: #حظر" />
          </div>

          {/* إعداد أمر الطرد */}
          <div style={styles.commandCard}>
            <div style={styles.cardHeader}>
              <span>👞 أمر الطرد (/kick)</span>
              <input type="checkbox" checked={settings.enableKick} onChange={e => setSettings({...settings, enableKick: e.target.checked})} />
            </div>
            <label style={styles.label}>الاختصار المخصص:</label>
            <input style={styles.input} value={settings.kickShortcut} onChange={e => setSettings({...settings, kickShortcut: e.target.value})} placeholder="مثال: #طرد" />
          </div>

          {/* إعداد أمر المسح */}
          <div style={styles.commandCard}>
            <div style={styles.cardHeader}>
              <span>🧹 أمر المسح (/clear)</span>
              <input type="checkbox" checked={settings.enableClear} onChange={e => setSettings({...settings, enableClear: e.target.checked})} />
            </div>
            <label style={styles.label}>الاختصار المخصص:</label>
            <input style={styles.input} value={settings.clearShortcut} onChange={e => setSettings({...settings, clearShortcut: e.target.value})} placeholder="مثال: #مسح" />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#36393f', color: 'white', fontFamily: 'Arial' },
  sidebar: { width: '250px', backgroundColor: '#2f3136', padding: '20px' },
  main: { flex: 1, padding: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' },
  commandCard: { backgroundColor: '#2f3136', padding: '20px', borderRadius: '10px', border: '1px solid #444' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 'bold' },
  input: { width: '100%', padding: '10px', backgroundColor: '#40444b', color: 'white', border: 'none', borderRadius: '5px', marginTop: '5px' },
  label: { fontSize: '13px', color: '#b9bbbe' },
  navBtn: { width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none', color: '#b9bbbe', cursor: 'pointer' },
  activeBtn: { width: '100%', padding: '12px', textAlign: 'left', backgroundColor: '#4f545c', border: 'none', color: 'white', borderRadius: '5px' },
  saveBtn: { width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#3ba55d', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }
};
