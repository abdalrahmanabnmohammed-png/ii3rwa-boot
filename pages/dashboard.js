import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import EmbedCreator from './embed-creator'; // ربط صفحة الإيمبد

export default function ProDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('embeds');

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>جاري التحميل...</div>;

  return (
    <div style={styles.container}>
      {/* القائمة الجانبية (نفس الصورة الأولى حرفياً) */}
      <aside style={styles.sidebar}>
        <div style={styles.serverHeader}><div style={styles.serverIcon}>JO</div> JO Store</div>
        <div style={styles.navScroll}>
          <div style={styles.sectionTitle}>عام</div>
          <NavItem label="نظرة عامة" icon="👁️" onClick={() => setActiveTab('overview')} />
          <NavItem label="رسائل الإيمبد" icon="📄" active={activeTab === 'embeds'} onClick={() => setActiveTab('embeds')} />
          
          <div style={styles.sectionTitle}>قائمة الخصائص</div>
          <NavItem label="الأوامر العامة" icon="⚙️" active />
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

      {/* منطقة المحتوى */}
      <main style={styles.main}>
        {activeTab === 'embeds' && <EmbedCreator />}
        {activeTab !== 'embeds' && <div style={{padding:'40px'}}>قريباً...</div>}
      </main>
    </div>
  );
}

function NavItem({ label, icon, active, premium, onClick }) {
  return (
    <div style={{...styles.navItem, backgroundColor: active ? '#3f4147' : 'transparent'}} onClick={onClick}>
      <div style={styles.navLeft}>
        <span style={{fontSize:'18px'}}>{icon}</span>
        <span style={{color: active ? '#fff' : '#949ba4', fontSize:'14px'}}>{label}</span>
      </div>
      {premium && <span style={styles.premiumBadge}>بريميوم</span>}
      {active && !premium && <div style={styles.checkIcon}>✓</div>}
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', direction: 'rtl' },
  sidebar: { width: '280px', backgroundColor: '#2b2d31', borderLeft: '1px solid #1e1f22', overflowY: 'auto' },
  serverHeader: { padding: '20px', display: 'flex', alignItems: 'center', gap: '10px', color:'white', borderBottom: '1px solid #1e1f22' },
  serverIcon: { width: '35px', height: '35px', backgroundColor: '#5865f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navScroll: { padding: '10px' },
  sectionTitle: { padding: '15px 10px 5px', fontSize: '11px', color: '#80848e', fontWeight: 'bold' },
  navItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginBottom: '2px' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  premiumBadge: { fontSize: '9px', backgroundColor: '#f0b232', color: '#000', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold' },
  checkIcon: { width: '16px', height: '16px', backgroundColor: '#23a559', borderRadius: '50%', fontSize: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1, backgroundColor: '#313338', overflowY: 'auto' }
};
