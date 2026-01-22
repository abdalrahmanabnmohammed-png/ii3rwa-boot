import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('home');
  const [sec, setSec] = useState({
    antiBot: false, antiLink: false, antiInvite: false, 
    antiSpam: false, antiBadWords: false, antiFake: false, minAccountAge: 7
  });

  useEffect(() => {
    fetch('/api/security').then(res => res.json()).then(data => data && setSec(data));
  }, []);

  const save = async () => {
    await fetch('/api/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sec),
    });
    alert('✅ تم تفعيل أنظمة الحماية بنجاح!');
  };

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>جاري التحميل...</div>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>ii3RwA Security</div>
        <button onClick={() => setActiveTab('home')} style={activeTab === 'home' ? styles.activeBtn : styles.btn}>🏠 الرئيسية</button>
        <button onClick={() => setActiveTab('sec')} style={activeTab === 'sec' ? styles.activeBtn : styles.btn}>🛡️ مركز الحماية</button>
      </aside>

      <main style={styles.main}>
        {activeTab === 'sec' && (
          <div style={styles.card}>
            <h3>🛡️ إعدادات حماية السيرفر</h3>
            <div style={styles.grid}>
              <Toggle title="منع البوتات" val={sec.antiBot} set={() => setSec({...sec, antiBot: !sec.antiBot})} />
              <Toggle title="منع الروابط" val={sec.antiLink} set={() => setSec({...sec, antiLink: !sec.antiLink})} />
              <Toggle title="منع الدعوات" val={sec.antiInvite} set={() => setSec({...sec, antiInvite: !sec.antiInvite})} />
              <Toggle title="منع السبام" val={sec.antiSpam} set={() => setSec({...sec, antiSpam: !sec.antiSpam})} />
              <Toggle title="فلتر الكلمات" val={sec.antiBadWords} set={() => setSec({...sec, antiBadWords: !sec.antiBadWords})} />
              <Toggle title="منع الحسابات الوهمية" val={sec.antiFake} set={() => setSec({...sec, antiFake: !sec.antiFake})} />
            </div>
            <button onClick={save} style={styles.saveBtn}>حفظ الإعدادات</button>
          </div>
        )}
      </main>
    </div>
  );
}

function Toggle({ title, val, set }) {
  return (
    <div style={styles.toggleRow}>
      <span>{title}</span>
      <div onClick={set} style={{...styles.switch, backgroundColor: val ? '#23a559' : '#80848e'}}>
        <div style={{...styles.dot, right: val ? '22px' : '2px'}} />
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', direction: 'rtl' },
  sidebar: { width: '280px', backgroundColor: '#2b2d31', padding: '15px' },
  brand: { color: '#5865f2', fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' },
  btn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer' },
  activeBtn: { width: '100%', padding: '12px', backgroundColor: '#3f4147', color: 'white', textAlign: 'right', borderRadius: '5px' },
  main: { flex: 1, padding: '40px' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '12px', color: 'white' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#1e1f22', borderRadius: '8px' },
  switch: { width: '40px', height: '20px', borderRadius: '10px', cursor: 'pointer', position: 'relative', transition: '0.3s' },
  dot: { width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', transition: '0.3s' },
  saveBtn: { width: '100%', padding: '15px', backgroundColor: '#5865f2', color: 'white', border: 'none', borderRadius: '8px', marginTop: '30px', cursor: 'pointer', fontWeight: 'bold' }
};
