import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function CleanDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('home');
  const [cmdNames, setCmdNames] = useState({ clearName: 'clear', banName: 'ban', unbanName: 'unban', muteName: 'mute' });
  const [reasons, setReasons] = useState([]);
  const [newReason, setNewReason] = useState('');

  useEffect(() => {
    fetch('/api/commands').then(res => res.json()).then(data => {
      if (data) {
        setCmdNames({
          clearName: data.clearName || 'clear',
          banName: data.banName || 'ban',
          unbanName: data.unbanName || 'unban',
          muteName: data.muteName || 'mute'
        });
        setReasons(data.banReasons || []);
      }
    });
  }, []);

  const addReason = () => {
    if (newReason.trim()) {
      setReasons([...reasons, newReason.trim()]);
      setNewReason('');
    }
  };

  const removeReason = (index) => {
    setReasons(reasons.filter((_, i) => i !== index));
  };

  const saveAll = async () => {
    await fetch('/api/commands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cmdNames, banReasons: reasons }),
    });
    alert('✅ تم حفظ إعدادات الأوامر والأسباب بنجاح!');
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
        {activeTab === 'home' && (
          <div style={styles.card}>
            <h1>أهلاً بك {session.user.name}</h1>
            <p>يمكنك الآن تخصيص أوامر الإشراف وأسباب الحظر من القائمة الجانبية.</p>
          </div>
        )}
        
        {activeTab === 'cmds' && (
          <div style={styles.card}>
            <h3 style={{marginBottom:'20px'}}>⚙️ تخصيص الأوامر والأسباب</h3>
            
            <div style={styles.inputGroup}><label>اسم أمر المسح:</label><input style={styles.input} value={cmdNames.clearName} onChange={e => setCmdNames({...cmdNames, clearName: e.target.value})} /></div>
            <div style={styles.inputGroup}><label>اسم أمر الحظر:</label><input style={styles.input} value={cmdNames.banName} onChange={e => setCmdNames({...cmdNames, banName: e.target.value})} /></div>

            <div style={{marginTop:'30px', borderTop:'1px solid #3f4147', paddingTop:'20px'}}>
              <h4>📋 قائمة أسباب الحظر</h4>
              <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                <input style={styles.input} placeholder="أضف سبباً (مثال: سبام)" value={newReason} onChange={e => setNewReason(e.target.value)} />
                <button onClick={addReason} style={styles.addBtn}>أضف</button>
              </div>
              <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                {reasons.map((r, i) => (
                  <div key={i} style={styles.tag}>
                    <span>{r}</span>
                    <span onClick={() => removeReason(i)} style={{cursor:'pointer', color:'#ed4245'}}>×</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={saveAll} style={styles.saveBtn}>حفظ جميع الإعدادات</button>
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
  btn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer', marginBottom:'5px' },
  activeBtn: { width: '100%', padding: '12px', backgroundColor: '#3f4147', color: 'white', textAlign: 'right', borderRadius: '5px', marginBottom:'5px' },
  main: { flex: 1, padding: '40px', overflowY:'auto' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '10px', color: 'white', border:'1px solid #383a40' },
  inputGroup: { marginBottom: '15px' },
  input: { width: '100%', padding: '12px', backgroundColor: '#1e1f22', border: '1px solid #111', color: 'white', borderRadius:'5px' },
  addBtn: { padding:'0 20px', backgroundColor:'#5865f2', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
  saveBtn: { width: '100%', padding: '15px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop:'30px', fontWeight:'bold' },
  tag: { backgroundColor:'#1e1f22', padding:'5px 15px', borderRadius:'15px', display:'flex', alignItems:'center', gap:'10px', border:'1px solid #383a40' }
};
