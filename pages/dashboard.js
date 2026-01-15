import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    infoTitle: '', infoDescription: '', infoImage: '', infoThumbnail: '', infoColor: '#5865f2',
    ticketCategory: '', ticketSupportRole: '', ticketReasons: ''
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
    alert('✅ تم حفظ جميع الإعدادات المدمجة!');
  };

  if (!session) return <p style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول</p>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={{color:'#5865f2'}}>لوحة التحكم</h2>
        <p style={{fontSize:'12px', color:'#aaa'}}>نظام المعلومات والتذاكر</p>
        <button onClick={save} style={styles.saveBtn}>حفظ الإعدادات</button>
      </aside>

      <main style={styles.content}>
        <div style={styles.card}>
          <h3>📝 محتوى الرسالة (المعلومات)</h3>
          <label style={styles.label}>العنوان الرئيسي:</label>
          <input style={styles.input} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} />
          
          <label style={styles.label}>الوصف (المعلومات/القوانين):</label>
          <textarea style={{...styles.input, height:'120px'}} value={settings.infoDescription} onChange={e => setSettings({...settings, infoDescription: e.target.value})} placeholder="اكتب القوانين أو المعلومات هنا..." />

          <label style={styles.label}>رابط الصورة الكبيرة (Banner):</label>
          <input style={styles.input} value={settings.infoImage} onChange={e => setSettings({...settings, infoImage: e.target.value})} />

          <hr style={{margin:'20px 0', borderColor:'#444'}} />

          <h3>🎫 خيارات التذاكر</h3>
          <label style={styles.label}>أسباب التذاكر (افصل بفاصلة ,):</label>
          <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} placeholder="شكوى, دعم, استفسار" />

          <label style={styles.label}>ID فئة التذاكر (Category ID):</label>
          <input style={styles.input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})} />

          <label style={styles.label}>ID رتبة الدعم:</label>
          <input style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})} />
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#1e1f22', color: 'white', direction: 'rtl' },
  sidebar: { width: '250px', backgroundColor: '#2b2d31', padding: '20px' },
  content: { flex: 1, padding: '40px', overflowY: 'auto' },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', fontWeight: 'bold', cursor:'pointer' },
  card: { backgroundColor: '#2b2d31', padding: '25px', borderRadius: '10px' },
  label: { display: 'block', marginTop: '10px', color: '#b9bbbe' },
  input: { width: '100%', padding: '10px', margin: '5px 0 15px 0', backgroundColor: '#1e1f22', color: 'white', border: 'none', borderRadius: '5px' }
};
