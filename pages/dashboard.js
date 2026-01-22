import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('home');
  const [sec, setSec] = useState({
    antiBot: false, antiLink: false, antiInvite: false, antiSpam: false
  });

  // جلب البيانات مع معالجة الأخطاء
  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/security')
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setSec(data))
        .catch(err => console.error("Fetch error:", err));
    }
  }, [status]);

  const saveSecurity = async () => {
    try {
      const res = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sec),
      });
      if (res.ok) alert('✅ تم حفظ الإعدادات بنجاح!');
    } catch (err) {
      alert('❌ فشل الحفظ، تأكد من اتصال قاعدة البيانات');
    }
  };

  // حماية الصفحة: إذا لم يسجل الدخول أو جاري التحميل
  if (status === "loading") return <div style={styles.loader}>جاري التحميل...</div>;
  if (status === "unauthenticated") return <div style={styles.loader}>يرجى تسجيل الدخول أولاً</div>;

  return (
    <div style={styles.container}>
      {/* القائمة الجانبية */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>ii3RwA Control</div>
        <div style={styles.navGroup}>
          <p style={styles.sectionTitle}>الرئيسية</p>
          <button onClick={() => setActiveTab('home')} style={activeTab === 'home' ? styles.activeBtn : styles.btn}>🏠 شاشة التحكم</button>
          <p style={styles.sectionTitle}>الأنظمة</p>
          <button onClick={() => setActiveTab('sec')} style={activeTab === 'sec' ? styles.activeBtn : styles.btn}>🛡️ مركز الحماية</button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main style={styles.main}>
        <header style={styles.header}>
           <h2>{activeTab === 'home' ? 'لوحة التحكم' : 'إعدادات الحماية'}</h2>
           <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
             <span>{session?.user?.name}</span>
             <img src={session?.user?.image} style={styles.avatar} alt="user" />
           </div>
        </header>
        
        <div style={styles.content}>
           {activeTab === 'home' && (
             <div style={styles.card}>
                <h3>أهلاً بك في نظام ii3RwA 🚀</h3>
                <p style={{color:'#949ba4'}}>تم إصلاح أخطاء الـ Build. يمكنك الآن إدارة حماية سيرفرك بأمان.</p>
             </div>
           )}

           {activeTab === 'sec' && (
             <div style={styles.card}>
                <h3 style={{marginBottom:'20px'}}>🛡️ حماية السيرفر الكاملة</h3>
                <div style={styles.grid}>
                  <Toggle title="منع البوتات" val={sec.antiBot} set={() => setSec({...sec, antiBot: !sec.antiBot})} />
                  <Toggle title="منع الروابط" val={sec.antiLink} set={() => setSec({...sec, antiLink: !sec.antiLink})} />
                  <Toggle title="منع الدعوات" val={sec.antiInvite} set={() => setSec({...sec, antiInvite: !sec.antiInvite})} />
                  <Toggle title="منع السبام" val={sec.antiSpam} set={() => setSec({...sec, antiSpam: !sec.antiSpam})} />
                </div>
                <button onClick={saveSecurity} style={styles.saveBtn}>حفظ الإعدادات</button>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}

function Toggle({ title, val, set }) {
  return (
    <div style={styles.toggleRow} onClick={set}>
      <span>{title}</span>
      <div style={{...styles.switch, backgroundColor: val ? '#23a559' : '#80848e'}}>
        <div style={{...styles.dot, left: val ? '22px' : '2px'}} />
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', direction: 'rtl', fontFamily: 'sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#2b2d31', borderLeft: '1px solid #1e1f22' },
  brand: { padding: '25px', color: '#5865f2', fontSize: '22px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #1e1f22' },
  navGroup: { padding: '15px' },
  sectionTitle: { color: '#80848e', fontSize: '11px', fontWeight: 'bold', margin: '15px 10px 10px' },
  btn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer', borderRadius: '5px' },
  activeBtn: { width: '100%', padding: '12px', backgroundColor: '#3f4147', color: 'white', textAlign: 'right', borderRadius: '5px', fontWeight: 'bold' },
  main: { flex: 1, backgroundColor: '#313338', display: 'flex', flexDirection: 'column' },
  header: { padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2b2d31', color: 'white' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', border: '2px solid #5865f2' },
  content: { padding: '40px' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '12px', color: 'white', border: '1px solid #383a40' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#1e1f22', borderRadius: '8px', cursor: 'pointer' },
  switch: { width: '40px', height: '20px', borderRadius: '10px', position: 'relative', transition: '0.3s' },
  dot: { width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', transition: '0.3s' },
  saveBtn: { width: '100%', padding: '15px', backgroundColor: '#5865f2', color: 'white', border: 'none', borderRadius: '8px', marginTop: '30px', cursor: 'pointer', fontWeight: 'bold' },
  loader: { height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#1e1f22', color:'white' }
};
