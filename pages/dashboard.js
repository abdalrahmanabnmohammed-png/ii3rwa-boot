import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('embed');
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    infoTitle: 'مركز الدعم الفني',
    infoDescription: 'يرجى اختيار القسم المناسب من القائمة أدناه لفتح تذكرة.',
    infoImage: '',
    infoColor: '#5865f2',
    ticketCategory: '',
    ticketSupportRole: '',
    ticketReasons: 'شكوى, استفسار, دعم عام',
    msgWelcome: 'مرحباً {user}، كيف يمكننا مساعدتك؟'
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) setSettings({ ...data, ticketReasons: data.ticketReasons?.join(', ') || '' });
    });
  }, []);

  const save = async () => {
    setIsSaving(true);
    const reasons = settings.ticketReasons.split(',').map(r => r.trim()).filter(r => r !== "");
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, ticketReasons: reasons }),
    });
    setTimeout(() => {
      setIsSaving(false);
      alert('✅ تم مزامنة الإعدادات مع البوت بنجاح!');
    }, 500);
  };

  if (!session) return <div style={styles.loading}>جاري تحميل اللوحة...</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logoCircle}>ii</div>
          <h2>ii3RwA Panel</h2>
        </div>
        
        <nav style={styles.nav}>
          <button onClick={() => setActiveTab('embed')} style={activeTab === 'embed' ? styles.activeNav : styles.navBtn}>🎨 مظهر الرسالة</button>
          <button onClick={() => setActiveTab('ids')} style={activeTab === 'ids' ? styles.activeNav : styles.navBtn}>⚙️ إعدادات تقنية</button>
          <button onClick={() => setActiveTab('msgs')} style={activeTab === 'msgs' ? styles.activeNav : styles.navBtn}>💬 نصوص الردود</button>
        </nav>

        <div style={styles.sidebarFooter}>
          <button onClick={save} style={styles.saveBtn} disabled={isSaving}>
            {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <img src={session.user.image} style={styles.avatar} />
            <span>{session.user.name}</span>
          </div>
        </div>

        <div style={styles.layout}>
          {/* Form Side */}
          <div style={styles.formContainer}>
            {activeTab === 'embed' && (
              <div className="fade-in">
                <h3 style={styles.tabTitle}>تخصيص رسالة الاستقبال</h3>
                <label style={styles.label}>عنوان الإيمبد</label>
                <input style={styles.input} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} />
                
                <label style={styles.label}>نص الوصف</label>
                <textarea style={styles.textarea} value={settings.infoDescription} onChange={e => setSettings({...settings, infoDescription: e.target.value})} />
                
                <label style={styles.label}>رابط صورة البانر (URL)</label>
                <input style={styles.input} value={settings.infoImage} onChange={e => setSettings({...settings, infoImage: e.target.value})} />
              </div>
            )}

            {activeTab === 'ids' && (
              <div className="fade-in">
                <h3 style={styles.tabTitle}>المعرفات والروومات</h3>
                <label style={styles.label}>ID فئة التذاكر (Category)</label>
                <input style={styles.input} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})} />
                
                <label style={styles.label}>ID رتبة المسؤولين</label>
                <input style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})} />
              </div>
            )}
          </div>

          {/* Preview Side (Interactive) */}
          <div style={styles.previewContainer}>
            <h4 style={styles.previewTitle}>معاينة حية (Discord Preview)</h4>
            <div style={styles.discordEmbed}>
              <div style={styles.embedBar}></div>
              <div style={styles.embedContent}>
                <div style={styles.embedTitle}>{settings.infoTitle}</div>
                <div style={styles.embedDesc}>{settings.infoDescription}</div>
                {settings.infoImage && <img src={settings.infoImage} style={styles.embedImg} />}
                <div style={styles.discordSelect}>
                  <span>اختر من القائمة...</span>
                  <div style={styles.arrowDown}>▼</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#0f1011', color: '#f2f3f5', direction: 'rtl', fontFamily: 'Arial' },
  sidebar: { width: '260px', backgroundColor: '#18191c', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #232428' },
  brand: { padding: '25px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #232428' },
  logoCircle: { width: '35px', height: '35px', backgroundColor: '#5865f2', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  nav: { flex: 1, padding: '15px' },
  navBtn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer', borderRadius: '4px', marginBottom: '5px', fontSize: '15px' },
  activeNav: { width: '100%', padding: '12px', backgroundColor: '#35373c', color: 'white', border: 'none', textAlign: 'right', borderRadius: '4px', marginBottom: '5px', fontSize: '15px', fontWeight: 'bold' },
  sidebarFooter: { padding: '20px', borderTop: '1px solid #232428' },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { height: '60px', borderBottom: '1px solid #232428', display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'flex-end' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%' },
  layout: { display: 'flex', flex: 1, padding: '30px', gap: '30px', overflowY: 'auto' },
  formContainer: { flex: 1, backgroundColor: '#2b2d31', padding: '25px', borderRadius: '8px' },
  previewContainer: { width: '400px' },
  tabTitle: { marginBottom: '20px', fontSize: '18px' },
  label: { display: 'block', fontSize: '13px', color: '#b5bac1', marginBottom: '8px', marginTop: '15px' },
  input: { width: '100%', padding: '12px', backgroundColor: '#1e1f22', border: '1px solid #1e1f22', color: 'white', borderRadius: '4px' },
  textarea: { width: '100%', padding: '12px', backgroundColor: '#1e1f22', border: '1px solid #1e1f22', color: 'white', borderRadius: '4px', height: '100px', resize: 'none' },
  previewTitle: { marginBottom: '15px', color: '#949ba4', fontSize: '14px' },
  discordEmbed: { backgroundColor: '#2b2d31', borderLeft: '4px solid #5865f2', borderRadius: '4px', padding: '15px', maxWidth: '350px' },
  embedTitle: { fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' },
  embedDesc: { fontSize: '14px', color: '#dbdee1', whiteSpace: 'pre-wrap' },
  embedImg: { width: '100%', borderRadius: '4px', marginTop: '10px' },
  discordSelect: { marginTop: '15px', backgroundColor: '#1e1f22', padding: '10px', borderRadius: '4px', border: '1px solid #111', display: 'flex', justifyContent: 'space-between', color: '#949ba4', fontSize: '13px' }
};
