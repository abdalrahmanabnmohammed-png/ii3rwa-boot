import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('home');
  const [sec, setSec] = useState({
    antiBot: false, antiLink: false, antiInvite: false, antiSpam: false
  });

  // جلب البيانات فقط عند نجاح تسجيل الدخول
  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/security')
        .then(res => res.json())
        .then(data => data && setSec(data))
        .catch(err => console.log("Waiting for API..."));
    }
  }, [status]);

  const saveSecurity = async () => {
    await fetch('/api/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sec),
    });
    alert('✅ تم حفظ الإعدادات!');
  };

  if (status === "loading") return <div style={styles.center}>جاري التحميل...</div>;
  if (status === "unauthenticated") return <div style={styles.center}>يرجى تسجيل الدخول</div>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>ii3RwA Control</div>
        <div style={styles.nav}>
          <button onClick={() => setActiveTab('home')} style={activeTab === 'home' ? styles.activeBtn : styles.btn}>🏠 الرئيسية</button>
          <button onClick={() => setActiveTab('sec')} style={activeTab === 'sec' ? styles.activeBtn : styles.btn}>🛡️ الحماية</button>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
           <span>أهلاً، {session?.user?.name}</span>
           <img src={session?.user?.image} style={styles.avatar} alt="" />
        </div>
        
        <div style={styles.content}>
           {activeTab === 'home' && (
             <div style={styles.card}>
                <h3>بداية نظيفة للمشروع 🚀</h3>
                <p>تم تبسيط الكود لضمان نجاح الـ Build في Vercel.</p>
             </div>
           )}

           {activeTab === 'sec' && (
             <div style={styles.card}>
                <h3>🛡️ إعدادات الحماية</h3>
                <div style={styles.grid}>
                  <div style={styles.toggleRow} onClick={() => setSec({...sec, antiLink: !sec.antiLink})}>
                    <span>منع الروابط</span>
                    <div style={{...styles.switch, backgroundColor: sec.antiLink ? '#23a559' : '#80848e'}}>
                      <div style={{...styles.dot, left: sec.antiLink ? '22px' : '2px'}} />
                    </div>
                  </div>
                  {/* يمكن إضافة بقية التوجلز هنا بنفس الطريقة */}
                </div>
                <button onClick={saveSecurity} style={styles.saveBtn}>حفظ الإعدادات</button>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', direction: 'rtl' },
  sidebar: { width: '260px', backgroundColor: '#2b2d31', borderLeft: '1px solid #1e1f22', padding: '15px' },
  brand: { color: '#5865f2', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' },
  btn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer' },
  activeBtn: { width: '100%', padding: '12px', backgroundColor: '#3f4147', color: 'white', textAlign: 'right', borderRadius: '5px' },
  main: { flex: 1, backgroundColor: '#313338' },
  header: { padding: '15px 30px', backgroundColor: '#2b2d31', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', color: 'white' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%' },
  content: { padding: '30px' },
  card: { backgroundColor: '#2b2d31', padding: '25px', borderRadius: '10px', color: 'white', border: '1px solid #383a40' },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', cursor: 'pointer' },
  switch: { width: '40px', height: '20px', borderRadius: '10px', position: 'relative', transition: '0.3s' },
  dot: { width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', transition: '0.3s' },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: '#5865f2', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', cursor: 'pointer' },
  center: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1f22', color: 'white' }
};
