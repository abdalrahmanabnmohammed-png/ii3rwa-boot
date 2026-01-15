import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import EmbedMessages from './embeds'; // استيراد صفحة رسائل الإيمبد التي صممناها

export default function ProDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('embeds'); // جعل رسائل الإيمبد الصفحة الافتراضية
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    antiLink: false, youtubeChannel: '', welcomeChannel: '',
    infoTitle: '', infoDescription: '', ticketReasons: '',
    ticketCategory: '', ticketSupportRole: '', logChannel: ''
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
    alert('✅ تم حفظ التغييرات بنجاح!');
  };

  if (!session) return <div style={styles.loading}>جاري التحميل...</div>;

  return (
    <div style={styles.container}>
      {/* القائمة الجانبية بستايل برو بوت (مطابقة للصورة) */}
      <aside style={styles.sidebar}>
        <div style={styles.serverHeader}>
          <div style={styles.serverIcon}>JO</div>
          <span>JO Store</span>
        </div>

        <div style={styles.navScroll}>
          <div style={styles.sectionTitle}>عام</div>
          <NavItem label="نظرة عامة" icon="👁️" onClick={() => setActiveTab('overview')} />
          <NavItem label="إعدادات السيرفر" icon="⚙️" />
          <NavItem label="رسائل الإيمبد" icon="📄" active={activeTab === 'embeds'} onClick={() => setActiveTab('embeds')} />
          <NavItem label="اشتراكات البريميوم" icon="💎" />

          <div style={styles.sectionTitle}>قائمة الخصائص</div>
          <NavItem label="الأوامر العامة" icon="🛠️" active />
          <NavItem label="الترحيب & المغادرة" icon="👋" active />
          <NavItem label="الرد التلقائي" icon="💬" active />
          <NavItem label="نظام اللفلات" icon="📊" active />
          <NavItem label="الألوان" icon="🎨" active />
          <NavItem label="التذاكر (Tickets)" icon="🎫" active premium onClick={() => setActiveTab('tickets')} />

          <div style={styles.sectionTitle}>الإشراف</div>
          <NavItem label="الإشراف" icon="⚖️" active />
          <NavItem label="اللوق" icon="📜" active />
          <NavItem label="الرقابة التلقائية" icon="🤖" active />
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main style={styles.main}>
        <header style={styles.mainHeader}>
          <div style={styles.headerTitle}>
             <h2 style={{margin:0}}>{activeTab === 'embeds' ? 'رسائل الإيمبد' : 'إعدادات القسم'}</h2>
          </div>
          <div style={styles.headerActions}>
            <button onClick={saveSettings} style={styles.saveBtn} disabled={isSaving}>
              {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
            <img src={session.user.image} style={styles.userAvatar} />
          </div>
        </header>

        <div style={styles.contentArea}>
          {activeTab === 'embeds' && <EmbedMessages />}
          
          {activeTab === 'tickets' && (
            <div style={styles.card}>
              <h3>🎫 إعدادات التذاكر</h3>
              <label style={styles.label}>عنوان الإيمبد</label>
              <input style={styles.input} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} />
              <label style={styles.label}>الأقسام (فاصلة ,)</label>
              <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// مكون فرعي لعناصر القائمة الجانبية (Sidebar Items)
function NavItem({ label, icon, active, premium, onClick }) {
  return (
    <div style={{...styles.navItem, backgroundColor: active ? '#3f4147' : 'transparent'}} onClick={onClick}>
      <div style={styles.navLeft}>
        {active && <div style={styles.activeIndicator} />}
        <span style={styles.navIcon}>{icon}</span>
        <span style={{color: active ? '#fff' : '#949ba4'}}>{label}</span>
      </div>
      {premium && <span style={styles.premiumBadge}>بريميوم</span>}
      {!premium && active && <div style={styles.checkIcon}>L</div>} 
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', color: '#dbdee1', direction: 'rtl', fontFamily: 'sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#2b2d31', borderLeft: '1px solid #1e1f22', display: 'flex', flexDirection: 'column' },
  serverHeader: { padding: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #1e1f22' },
  serverIcon: { width: '35px', height: '35px', backgroundColor: '#313338', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navScroll: { flex: 1, overflowY: 'auto', padding: '10px' },
  sectionTitle: { padding: '15px 10px 5px', fontSize: '11px', color: '#80848e', fontWeight: 'bold', textTransform: 'uppercase' },
  navItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginBottom: '2px' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' },
  activeIndicator: { position: 'absolute', right: '-10px', width: '4px', height: '20px', backgroundColor: '#5865f2', borderRadius: '0 4px 4px 0' },
  navIcon: { fontSize: '18px' },
  premiumBadge: { fontSize: '9px', backgroundColor: '#f0b232', color: '#000', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold' },
  checkIcon: { width: '15px', height: '15px', backgroundColor: '#23a559', borderRadius: '50%', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#313338' },
  mainHeader: { padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2b2d31' },
  headerActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  userAvatar: { width: '35px', height: '35px', borderRadius: '50%', border: '2px solid #5865f2' },
  saveBtn: { backgroundColor: '#23a559', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  contentArea: { padding: '40px', flex: 1, overflowY: 'auto' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '10px', border: '1px solid #383a40' },
  label: { display: 'block', margin: '15px 0 8px', fontSize: '14px', color: '#b5bac1' },
  input: { width: '100%', padding: '12px', backgroundColor: '#1e1f22', border: 'none', color: '#fff', borderRadius: '5px' },
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1f22', color: 'white' }
};
