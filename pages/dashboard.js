import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function CleanDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('home');
  const [cmdNames, setCmdNames] = useState({ clearName: 'clear', banName: 'ban', unbanName: 'unban', muteName: 'mute' });

  useEffect(() => {
    fetch('/api/commands').then(res => res.json()).then(data => data && setCmdNames(data));
  }, []);

  const saveCommands = async () => {
    await fetch('/api/commands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cmdNames),
    });
    alert('✅ تم حفظ الأسماء! سيقوم البوت بتحديثها عند إعادة التشغيل.');
  };

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول...</div>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>ii3RwA Panel</div>
        <button onClick={() => setActiveTab('home')} style={activeTab === 'home' ? styles.activeBtn : styles.btn}>🏠 الرئيسية</button>
        <button onClick={() => setActiveTab('cmds')} style={activeTab === 'cmds' ? styles.activeBtn : styles.btn}>🛠️ أوامر الإشراف</button>
      </aside>

      <main style={styles.main}>
        {activeTab === 'home' && <div style={styles.card}><h1>أهلاً بك {session.user.name}</h1><p>استخدم القائمة لتعديل الأوامر.</p></div>}
        
        {activeTab === 'cmds' && (
          <div style={styles.card}>
            <h3>⚙️ تخصيص أسماء الأوامر</h3>
            <div style={styles.inputGroup}><label>اسم أمر المسح:</label><input style={styles.input} value={cmdNames.clearName} onChange={e => setCmdNames({...cmdNames, clearName: e.target.value})} /></div>
            <div style={styles.inputGroup}><label>اسم أمر الحظر:</label><input style={styles.input} value={cmdNames.banName} onChange={e => setCmdNames({...cmdNames, banName: e.target.value})} /></div>
            <button onClick={saveCommands} style={styles.saveBtn}>حفظ الإعدادات</button>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', direction: 'rtl' },
  sidebar: { width: '280px', backgroundColor: '#2b2d31', padding: '15px' },
  brand: { color: 'white', fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' },
  btn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer' },
  activeBtn: { width: '100%', padding: '12px', backgroundColor: '#3f4147', color: 'white', textAlign: 'right', borderRadius: '5px' },
  main: { flex: 1, padding: '40px' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '10px', color: 'white' },
  inputGroup: { marginBottom: '20px' },
  input: { width: '100%', padding: '10px', backgroundColor: '#1e1f22', border: 'none', color: 'white', marginTop: '5px' },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};
