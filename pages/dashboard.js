import { useState } from 'react';
import { useSession } from "next-auth/react";
import SecurityTab from './security';
import AutoReply from './auto-reply';

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('main');

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول...</div>;

  return (
    <div style={{display:'flex', height:'100vh', backgroundColor:'#1e1f22', direction:'rtl', fontFamily:'sans-serif'}}>
      {/* القائمة الجانبية بستايل برو بوت */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>ii3RwA Control</div>
        <div style={styles.navGroup}>
          <p style={styles.sectionTitle}>عام</p>
          <button onClick={() => setActiveTab('main')} style={activeTab === 'main' ? styles.activeBtn : styles.btn}>⚙️ الإعدادات الأساسية</button>
          
          <p style={styles.sectionTitle}>الخصائص</p>
          <button onClick={() => setActiveTab('security')} style={activeTab === 'security' ? styles.activeBtn : styles.btn}>🛡️ نظام الحماية</button>
          <button onClick={() => setActiveTab('autoreply')} style={activeTab === 'autoreply' ? styles.activeBtn : styles.btn}>💬 الرد التلقائي</button>
          <button onClick={() => setActiveTab('welcome')} style={activeTab === 'welcome' ? styles.activeBtn : styles.btn}>👋 الترحيب والمغادرة</button>
        </div>
      </aside>

      {/* محتوى الصفحات */}
      <main style={{flex:1, padding:'40px', overflowY:'auto'}}>
        {activeTab === 'main' && (
          <div style={{color:'white'}}>
            <h1>أهلاً بك، {session.user.name}</h1>
            <p style={{color:'#949ba4'}}>هذه هي البداية الجديدة لمشروعك المتكامل.</p>
          </div>
        )}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'autoreply' && <AutoReply />}
      </main>
    </div>
  );
}

const styles = {
  sidebar: { width:'280px', backgroundColor:'#2b2d31', borderLeft:'1px solid #1e1f22', padding:'15px' },
  brand: { color:'white', fontSize:'22px', fontWeight:'bold', textAlign:'center', marginBottom:'30px' },
  sectionTitle: { color:'#80848e', fontSize:'11px', fontWeight:'bold', margin:'20px 10px 10px' },
  btn: { width:'100%', padding:'12px', background:'none', border:'none', color:'#949ba4', textAlign:'right', cursor:'pointer', borderRadius:'5px', marginBottom:'5px' },
  activeBtn: { width:'100%', padding:'12px', backgroundColor:'#3f4147', border:'none', color:'white', textAlign:'right', borderRadius:'5px', marginBottom:'5px', fontWeight:'bold' }
};
