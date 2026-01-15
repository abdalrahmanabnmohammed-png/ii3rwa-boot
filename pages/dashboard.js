import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Overview from './overview'; // استيراد صفحة النظرة العامة التي تحتوي على الرسوم البيانية

export default function ProDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview'); // الصفحة الافتراضية عند الفتح
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    antiLink: false, youtubeChannel: '', welcomeChannel: '',
    infoTitle: '', infoDescription: '', ticketReasons: '',
    ticketCategory: '', ticketSupportRole: '', logChannel: '',
    msgWelcome: '', msgClaim: '', msgUnclaim: ''
  });

  // جلب الإعدادات من قاعدة البيانات عند تحميل الصفحة
  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) setSettings({ ...data, ticketReasons: data.ticketReasons?.join(', ') || '' });
    });
  }, []);

  // دالة الحفظ مع تأثير التحميل
  const saveSettings = async () => {
    setIsSaving(true);
    const reasons = settings.ticketReasons.split(',').map(r => r.trim()).filter(r => r !== "");
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, ticketReasons: reasons }),
    });
    setTimeout(() => {
      setIsSaving(false);
      alert('✅ تم حفظ كافة التغييرات ومزامنتها مع البوت!');
    }, 500);
  };

  if (!session) return <div style={styles.loading}>جاري التحقق من الهوية...</div>;

  return (
    <div style={styles.container}>
      {/* القائمة الجانبية (Sidebar) بستايل برو بوت */}
      <aside style={styles.sidebar}>
        <div style={styles.serverHeader}>
          <div style={styles.serverIcon}>{session.user.name?.charAt(0)}</div>
          <span>ii3RwA Control</span>
        </div>

        <div style={styles.navScroll}>
          <div style={styles.sectionTitle}>عام</div>
          <NavItem label="نظرة عامة" icon="👁️" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem label="رسائل الإيمبد" icon="📄" />

          <div style={styles.sectionTitle}>قائمة الخصائص</div>
          <NavItem label="التذاكر (Tickets)" icon="🎫" active={activeTab === 'tickets'} premium onClick={() => setActiveTab('tickets')} />
          <NavItem label="الروابط والحماية" icon="🔗" active={activeTab === 'security'} premium onClick={() => setActiveTab('security')} />
          <NavItem label="الرد التلقائي" icon="💬" />
          <NavItem label="الألوان" icon="🎨" />

          <div style={styles.sectionTitle}>الإشراف</div>
          <NavItem label="اللوق (Logs)" icon="📜" />
          <NavItem label="الرقابة التلقائية" icon="🤖" />
        </div>
      </aside>

      {/* المحتوى الرئيسي للموقع */}
      <main style={styles.main}>
        <header style={styles.mainHeader}>
          <div style={styles.headerInfo}>
            <h2 style={{margin:0}}>{activeTab === 'overview' ? 'الإحصائيات والنظرة العامة' : 'إعدادات القسم'}</h2>
          </div>
          <div style={styles.headerActions}>
            <button onClick={saveSettings} style={styles.saveBtn} disabled={isSaving}>
              {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
            <img src={session.user.image} style={styles.avatar} />
          </div>
        </header>

        <div style={styles.contentArea}>
          {activeTab === 'overview' && <Overview />}

          {activeTab === 'tickets' && (
            <div style={styles.card}>
              <h3>🎫 إعدادات نظام التذاكر المطور</h3>
              <label style={styles.label}>عنوان الإيمبد الرئيسي</label>
              <input style={styles.input} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} />
              
              <label style={styles.label}>أقسام التذاكر (افصل بـ ,)</label>
              <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} />

              <label style={styles.label}>ID رتبة الدعم</label>
              <input style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})} />
            </div>
          )}

          {activeTab === 'security' && (
            <div style={styles.card}>
              <h3>🛡️ إعدادات الحماية والرقابة</h3>
              <div style={styles.switchRow}>
                <span>تفعيل مانع الروابط (Anti-Link)</span>
                <input type="checkbox" checked={settings.antiLink} onChange={e => setSettings({...settings, antiLink: e.target.checked})} />
              </div>
              <label style={styles.label}>ID روم اليوتيوب</label>
              <input style={styles.input} value={settings.youtubeChannel} onChange={e => setSettings({...settings, youtubeChannel: e.target.value})} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// مكون فرعي للعناصر في القائمة الجانبية
function NavItem({ label, icon, active, premium, onClick }) {
  return (
    <div style={{...styles.navItem, backgroundColor: active ? '#3f4147' : 'transparent', color: active ? '#fff' : '#949ba4'}} onClick={onClick}>
      <div style={styles.navLeft}>
        <span style={{fontSize:'18px'}}>{icon}</span>
        <span>{label}</span>
      </div>
      {premium && <span style={styles.premiumBadge}>PRO</span>}
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', color: '#dbdee1', direction: 'rtl' },
  sidebar: { width: '280px', backgroundColor: '#2b2d31', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1e1f22' },
  serverHeader: { padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #1e1f22' },
  serverIcon: { width: '32px', height: '32px', backgroundColor: '#5865f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
  navScroll: { padding: '10px', flex: 1, overflowY: 'auto' },
  sectionTitle: { padding: '15px 10px 5px', fontSize: '11px', fontWeight: 'bold', color: '#80848e', textTransform: 'uppercase' },
  navItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', marginBottom: '2px', transition: '0.2s' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  premiumBadge: { fontSize: '9px', backgroundColor: '#f0b232', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#313338' },
  mainHeader: { padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2b2d31', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  headerActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', border: '2px solid #5865f2' },
  saveBtn: { backgroundColor: '#23a559', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  contentArea: { padding: '40px', flex: 1, overflowY: 'auto' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '8px', border: '1px solid #383a40' },
  label: { display: 'block', margin: '15px 0 8px', fontSize: '13px', color: '#b5bac1' },
  input: { width: '100%', padding: '12px', backgroundColor: '#1e1f22', border: '1px solid #111', color: '#fff', borderRadius: '5px' },
  switchRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#1e1f22', borderRadius: '5px', marginBottom: '10px' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1f22', color: 'white' }
};
