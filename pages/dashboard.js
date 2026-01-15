import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    infoTitle: '', infoDescription: '', infoImage: '', infoColor: '#5865f2',
    ticketCategory: '', ticketSupportRole: '', ticketReasons: '', logChannel: ''
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) setSettings({ ...data, ticketReasons: data.ticketReasons?.join(', ') || '' });
    });
  }, []);

  const save = async () => {
    const reasonsArray = settings.ticketReasons.split(',').map(r => r.trim()).filter(r => r !== "");
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, ticketReasons: reasonsArray }),
    });
    alert('✅ تم الحفظ بنجاح!');
  };

  if (!session) return null;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2>لوحة التحكم</h2>
        <button onClick={save} style={styles.saveBtn}>حفظ الإعدادات</button>
      </aside>

      <main style={styles.content}>
        <div style={styles.card}>
          <h3>📝 إعدادات الرسالة والمعلومات</h3>
          <input style={styles.input} placeholder="العنوان" value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} />
          <textarea style={{...styles.input, height:'100px'}} placeholder="الوصف والقوانين" value={settings.infoDescription} onChange={e => setSettings({...settings, infoDescription: e.target.value})} />
          <input style={styles.input} placeholder="رابط صورة البانر" value={settings.infoImage} onChange={e => setSettings({...settings, infoImage: e.target.value})} />

          <hr style={{margin:'20px 0', borderColor:'#444'}} />

          <h3>🔒 نظام الإغلاق والأرشفة</h3>
          <label style={styles.label}>ID روم السجلات (Logs):</label>
          <input style={styles.input} placeholder="أدخل ID الروم الذي ستحفظ فيه سجلات التذاكر" value={settings.logChannel} onChange={e => setSettings({...settings, logChannel: e.target.value})} />

          <label style={styles.label}>ID فئة التذاكر (Category):</label>
          <input style={styles.input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})} />

          <label style={styles.label}>أسباب التذاكر (افصل بفاصلة ,):</label>
          <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} />
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#1e1f22', color: 'white', direction: 'rtl' },
  sidebar: { width: '250px', backgroundColor: '#2b2d31', padding: '20px' },
  content: { flex: 1, padding: '40px', overflowY: 'auto' },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor:'pointer' },
  card: { backgroundColor: '#2b2d31', padding: '25px', borderRadius: '10px' },
  label: { display: 'block', marginTop: '10px', fontSize: '13px', color: '#b9bbbe' },
  input: { width: '100%', padding: '10px', margin: '5px 0 15px 0', backgroundColor: '#1e1f22', color: 'white', border: 'none', borderRadius: '5px' }
};
