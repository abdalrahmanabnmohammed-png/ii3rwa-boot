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
  brand: { padding: '25px', color: 'white', fontSize
