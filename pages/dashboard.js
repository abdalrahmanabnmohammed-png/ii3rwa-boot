import { useState } from 'react';
import { useSession } from "next-auth/react";

export default function CleanDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('home');

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول...</div>;

  return (
    <div style={styles.container}>
      {/* القائمة الجانبية الفارغة */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>ii3RwA Panel</div>
        <div style={styles.navScroll}>
          <p style={styles.sectionTitle}>القائمة الرئيسية</p>
          <button onClick={() => setActiveTab('home')} style={activeTab === 'home' ? styles.activeBtn : styles.btn}>🏠 الرئيسية</button>
        </div>
      </aside>

      {/* منطقة المحتوى الفارغة */}
      <main style={styles.main}>
        <header style={styles.header}>
           <h2>{activeTab === 'home' ? 'لوحة التحكم' : 'قسم جديد'}</h2>
           <img src={session.user.image} style={styles.avatar} />
        </header>
        
        <div style={styles.content}>
           {activeTab === 'home' && (
             <div style={styles.welcomeCard}>
                <h3>أهلاً بك، {session.user.name} 👋</h3>
                <p>هذه هي البداية الجديدة للمشروع. كل شيء فارغ الآن لنبدأ البناء معاً خطوة بخطوة.</p>
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
  brand: { padding: '25px', color: 'white', fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #1e1f22', textAlign: 'center' },
  navScroll: { padding: '15px' },
  sectionTitle: { color: '#80848e', fontSize: '11px', fontWeight: 'bold', margin: '15px 10px 10px', textTransform: 'uppercase' },
  btn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer', borderRadius: '5px', marginBottom: '5px' },
  activeBtn: { width: '100%', padding: '12px', backgroundColor: '#3f4147', border: 'none', color: 'white', textAlign: 'right', borderRadius: '5px', marginBottom: '5px', fontWeight: 'bold' },
  main: { flex: 1, backgroundColor: '#313338', display: 'flex', flexDirection: 'column' },
  header: { padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2b2d31', color: 'white' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', border: '2px solid #5865f2' },
  content: { padding: '40px', overflowY: 'auto' },
  welcomeCard: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '8px', border: '1px solid #383a40', color: 'white' }
};
