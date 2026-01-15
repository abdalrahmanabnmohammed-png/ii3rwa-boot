import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('embed');
  const [settings, setSettings] = useState({
    infoTitle: '', infoDescription: '', infoImage: '', infoColor: '#5865f2',
    ticketCategory: '', ticketSupportRole: '', ticketReasons: '', logChannel: '',
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
    alert('✅ تم حفظ الإعدادات بنجاح!');
  };

  if (!session) return <div style={styles.loading}>جاري التحقق من تسجيل الدخول...</div>;

  return (
    <div style={styles.container}>
      {/* القائمة الجانبية - ستايل برو بوت */}
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}>
          <img src={session.user.image} style={styles.userAvatar} />
          <h3 style={styles.userName}>{session.user.name}</h3>
        </div>
        <nav style={styles.nav}>
          <button onClick={() => setActiveTab('embed')} style={activeTab === 'embed' ? styles.activeNav : styles.navBtn}>🎨 تصميم الإيمبد</button>
          <button onClick={() => setActiveTab('messages')} style={activeTab === 'messages' ? styles.activeNav : styles.navBtn}>💬 رسائل التذاكر</button>
          <button onClick={() => setActiveTab('config')} style={activeTab === 'config' ? styles.activeNav : styles.navBtn}>⚙️ الإعدادات التقنية</button>
          <div style={styles.divider}></div>
          <button onClick={save} style={styles.saveBtn}>حفظ التغييرات</button>
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h2>لوحة تحكم البوت الاحترافية</h2>
          <p>تعديل كافة نصوص وإعدادات نظام التذاكر</p>
        </header>

        <section style={styles.contentCard}>
          {activeTab === 'embed' && (
            <div style={styles.formGroup}>
              <h3>🎨 مظهر رسالة التذاكر (Embed)</h3>
              <label>عنوان الرسالة</label>
              <input style={styles.input} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} placeholder="مثال: مركز الدعم الفني" />
              
              <label>الوصف / المعلومات</label>
              <textarea style={styles.textarea} value={settings.infoDescription} onChange={e => setSettings({...settings, infoDescription: e.target.value})} placeholder="اكتب القوانين أو المعلومات هنا..." />
              
              <label>رابط الصورة الكبيرة (Banner)</label>
              <input style={styles.input} value={settings.infoImage} onChange={e => setSettings({...settings, infoImage: e.target.value})} placeholder="https://..." />
              
              <label>أقسام التذاكر (افصل بفاصلة ,)</label>
              <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} placeholder="شكوى, استفسار, شراء" />
            </div>
          )}

          {activeTab === 'messages' && (
            <div style={styles.formGroup}>
              <h3>💬 تخصيص رسائل التفاعل</h3>
              <p style={styles.hint}>المتغيرات: {'{user}'} منشن العضو | {'{admin}'} منشن الإداري | {'{reason}'} القسم</p>
              
              <label>رسالة الترحيب (داخل التكت)</label>
              <textarea style={styles.textarea} value={settings.msgWelcome} onChange={e => setSettings({...settings, msgWelcome: e.target.value})} />
              
              <label>رسالة الاستلام (Claim)</label>
              <textarea style={styles.textarea} value={settings.msgClaim} onChange={e => setSettings({...settings, msgClaim: e.target.value})} />
              
              <label>رسالة ترك التكت (Unclaim)</label>
              <textarea style={styles.textarea} value={settings.msgUnclaim} onChange={e => setSettings({...settings, msgUnclaim: e.target.value})} />
            </div>
          )}

          {activeTab === 'config' && (
            <div style={styles.formGroup}>
              <h3>⚙️ المعرفات والروومات (IDs)</h3>
              <label>ID فئة التذاكر (Category)</label>
              <input style={styles.input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})} />
              
              <label>ID رتبة الدعم (Support Role)</label>
              <input style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})} />
              
              <label>ID روم السجلات (Logs)</label>
              <input style={styles.input} value={settings.logChannel} onChange={e => setSettings({...settings, logChannel: e.target.value})} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// تنسيقات الـ CSS بأسلوب برو بوت
const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', color: '#dbdee1', direction: 'rtl', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#2b2d31', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1e1f22' },
  logoSection: { padding: '30px', textAlign: 'center', borderBottom: '1px solid #1e1f22' },
  userAvatar: { width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px', border: '3px solid #5865f2' },
  userName: { fontSize: '18px', color: 'white' },
  nav: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  navBtn: { padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer', borderRadius: '5px', transition: '0.2s' },
  activeNav: { padding: '12px', backgroundColor: '#3f4147', border: 'none', color: 'white', textAlign: 'right', borderRadius: '5px', fontWeight: 'bold' },
  saveBtn: { padding: '15px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  divider: { height: '1px', backgroundColor: '#444', margin: '10px 0' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  header: { marginBottom: '30px' },
  contentCard: { backgroundColor: '#313338', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#b5bac1' },
  input: { padding: '12px', backgroundColor: '#1e1f22', border: '1px solid #1e1f22', borderRadius: '5px', color: 'white', fontSize: '15px' },
  textarea: { padding: '12px', backgroundColor: '#1e1f22', border: '1px solid #1e1f22', borderRadius: '5px', color: 'white', height: '100px', resize: 'none' },
  hint: { fontSize: '12px', color: '#5865f2', marginBottom: '10px' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1f22', color: 'white' }
};
