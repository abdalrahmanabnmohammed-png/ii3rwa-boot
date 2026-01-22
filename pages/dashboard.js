import { useState } from 'react';
import { useSession } from "next-auth/react";

export default function CleanDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('home');

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول...</div>;

  return (
    <div style={styles.container}>
      {/* القائمة الجانبية بستايل برو بوت */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>ii3RwA Control</div>
        <div style={styles.navGroup}>
          <p style={styles.sectionTitle}>الرئيسية</p>
          <button onClick={() => setActiveTab('home')} style={activeTab === 'home' ? styles.activeBtn : styles.btn}>🏠 شاشة التحكم</button>
          
          <p style={styles.sectionTitle}>قيد التطوير</p>
          <button style={styles.disabledBtn}>⏳ بانتظار الميزات...</button>
        </div>
      </aside>

      {/* منطقة المحتوى */}
      <main style={styles.main}>
        <header style={styles.header}>
           <h2>{activeTab === 'home' ? 'لوحة التحكم' : 'قسم جديد'}</h2>
           <div style={styles.userInfo}>
             <span>{session.user.name}</span>
             <img src={session.user.image} style={styles.avatar} />
           </div>
        </header>
        
        <div style={styles.content}>
           {activeTab === 'home' && (
             <div style={styles.welcomeCard}>
                <h3>أهلاً بك في البداية الجديدة 🚀</h3>
                <p>تم تنظيف المشروع بالكامل. نحن الآن جاهزون لبناء الأنظمة (حماية، ترحيب، أوامر) خطوة بخطوة.</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', direction: 'rtl', fontFamily: 'sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#2b2d31', borderLeft: '1px solid #1e1f22', display: 'flex', flexDirection: 'column' },
  brand: { padding: '25px', color: '#5865f2', fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #1e1f22', textAlign: 'center' },
  navGroup: { padding: '15px' },
  sectionTitle: { color: '#80848e', fontSize: '11px', fontWeight: 'bold', margin: '15px 10px 10px', textTransform: 'uppercase' },
  btn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer', borderRadius: '5px', marginBottom: '5px' },
  activeBtn: { width: '100%', padding: '12px', backgroundColor: '#3f4147', color: 'white', textAlign: 'right', borderRadius: '5px', marginBottom: '5px', fontWeight: 'bold' },
  disabledBtn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#4e5058', textAlign: 'right', cursor: 'not-allowed' },
  main: { flex: 1, backgroundColor: '#313338', display: 'flex', flexDirection: 'column' },
  header: { padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2b2d31', color: 'white', borderBottom: '1px solid #1e1f22' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', border: '2px solid #5865f2' },
  content: { padding: '40px', overflowY: 'auto' },
  welcomeCard: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '12px', border: '1px solid #383a40', color: 'white', textAlign: 'center' }
};
