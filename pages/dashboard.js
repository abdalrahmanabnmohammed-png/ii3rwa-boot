import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function ProDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('tickets');
  const [settings, setSettings] = useState({
    antiLink: false, youtubeChannel: '', welcomeChannel: '',
    infoTitle: '', infoDescription: '', ticketReasons: '',
    ticketCategory: '', ticketSupportRole: '', logChannel: ''
  });

  // جلب البيانات عند التحميل
  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) setSettings({ ...data, ticketReasons: data.ticketReasons?.join(', ') || '' });
    });
  }, []);

  const saveSettings = async () => {
    const reasons = settings.ticketReasons.split(',').map(r => r.trim()).filter(r => r !== "");
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, ticketReasons: reasons }),
    });
    alert('✅ تم حفظ الإعدادات بنجاح!');
  };

  if (!session) return <div style={styles.loading}>جاري تحميل لوحة التحكم...</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar - القائمة الجانبية (نفس الصورة تماماً) */}
      <aside style={styles.sidebar}>
        <div style={styles.serverHeader}>
          <div style={styles.serverIcon}>JO</div>
          <span>JO Store</span>
        </div>

        <div style={styles.navScroll}>
          {/* قسم: عام */}
          <div style={styles.sectionTitle}>عام</div>
          <NavItem label="نظرة عامة" icon="👁️" />
          <NavItem label="إعدادات السيرفر" icon="⚙️" />
          <NavItem label="رسائل الإيمبد" icon="📄" />

          {/* قسم: قائمة الخصائص */}
          <div style={styles.sectionTitle}>قائمة الخصائص</div>
          <NavItem label="الأوامر العامة" icon="🛠️" active />
          <NavItem label="الترحيب والمغادرة" icon="👋" active />
          <NavItem label="الرد التلقائي" icon="💬" active />
          <NavItem label="نظام اللفلات" icon="📊" active />
          <NavItem label="الألوان" icon="🎨" active />
          <NavItem label="التذاكر (Tickets)" icon="🎫" active premium onClick={() => setActiveTab('tickets')} />
          <NavItem label="الروابط" icon="🔗" active premium onClick={() => setActiveTab('security')} />

          {/* قسم: الإشراف */}
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
            <h2>{activeTab === 'tickets' ? 'نظام التذاكر' : 'إعدادات الحماية'}</h2>
            <p>قم بتكوين خيارات البوت المتقدمة من هنا</p>
          </div>
          <button onClick={saveSettings} style={styles.saveBtn}>حفظ التغييرات</button>
        </header>

        <section style={styles.content}>
          {activeTab === 'tickets' && (
            <div style={styles.card}>
              <h3>⚙️ إعدادات التذاكر</h3>
              <label style={styles.label}>عنوان رسالة التذاكر</label>
              <input style={styles.input} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} />
              
              <label style={styles.label}>أقسام التذاكر (افصل بفاصلة ,)</label>
              <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} />

              <label style={styles.label}>ID رتبة الدعم</label>
              <input style={styles.input} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})} />
            </div>
          )}

          {activeTab === 'security' && (
            <div style={styles.card}>
              <h3>🛡️ حماية الروابط والرقابة</h3>
              <div style={styles.switchRow}>
                <span>تفعيل مانع الروابط</span>
                <input type="checkbox" checked={settings.antiLink} onChange={e => setSettings({...settings, antiLink: e.target.checked})} />
              </div>
              <label style={styles.label}>ID روم السجلات (Logs)</label>
              <input style={styles.input} value={settings.logChannel} onChange={e => setSettings({...settings, logChannel: e.target.value})} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// مكون فرعي لعناصر القائمة الجانبية
function NavItem({ label, icon, active, premium, onClick }) {
  return (
    <div style={{...styles.navItem, color: active ? '#fff' : '#949ba4'}} onClick={onClick}>
      <div style={styles.navLeft}>
        {active && <div style={styles.activeDot}></div>}
        <span style={styles.navIcon}>{icon}</span>
        <span>{label}</span>
      </div>
      {premium && <span style={styles.premiumBadge}>بريميوم</span>}
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', color: '#dbdee1', direction: 'rtl', fontFamily: 'sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#2b2d31', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderLeft: '1px solid #1e1f22' },
  serverHeader: { padding: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #1e1f22' },
  serverIcon: { width: '35px', height: '35px', backgroundColor: '#313338', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navScroll: { padding: '10px' },
  sectionTitle: { padding: '15px 10px 5px', fontSize: '11px', fontWeight: 'bold', color: '#80848e', textTransform: 'uppercase' },
  navItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginBottom: '2px', transition: '0.2s' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  activeDot: { width: '8px', height: '8px', backgroundColor: '#23a559', borderRadius: '50%' },
  premiumBadge: { fontSize: '9px', backgroundColor: '#f0b232', color: '#000', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#313338' },
  mainHeader: { padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2b2d31' },
  saveBtn: { backgroundColor: '#23a559', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  content: { padding: '40px', flex: 1, overflowY: 'auto' },
  card: { backgroundColor: '#2b2d31', padding: '25px', borderRadius: '10px' },
  label: { display: 'block', margin: '15px 0 8px', fontSize: '14px', color: '#b5bac1' },
  input: { width: '100%', padding: '12px', backgroundColor: '#1e1f22', border: 'none', color: '#fff', borderRadius: '5px' },
  switchRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#1e1f22', borderRadius: '5px' }
};
