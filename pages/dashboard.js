import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('home');
  const [sec, setSec] = useState({
    antiBot: false, antiLink: false, antiInvite: false, antiSpam: false
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/security')
        .then(res => res.json())
        .then(data => { if(data) setSec(data); });
    }
  }, [status]);

  const saveSecurity = async () => {
    const res = await fetch('/api/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sec),
    });
    if (res.ok) {
      alert('✅ تم الحفظ بنجاح! جرب الآن تفعيل منع الروابط في الديسكورد.');
    } else {
      alert('❌ حدث خطأ أثناء الحفظ.');
    }
  };

  if (status === "loading") return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>جاري التحميل...</div>;
  if (status === "unauthenticated") return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1f22', direction: 'rtl', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '260px', backgroundColor: '#2b2d31', padding: '15px' }}>
        <h2 style={{ color: '#5865f2', textAlign: 'center' }}>ii3RwA</h2>
        <button onClick={() => setActiveTab('home')} style={btnStyle(activeTab === 'home')}>🏠 الرئيسية</button>
        <button onClick={() => setActiveTab('sec')} style={btnStyle(activeTab === 'sec')}>🛡️ الحماية</button>
      </aside>

      <main style={{ flex: 1, padding: '40px', color: 'white' }}>
        {activeTab === 'sec' && (
          <div style={{ backgroundColor: '#2b2d31', padding: '30px', borderRadius: '12px' }}>
            <h3>إعدادات الحماية</h3>
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              <Toggle title="منع الروابط" val={sec.antiLink} set={() => setSec({...sec, antiLink: !sec.antiLink})} />
              <Toggle title="منع البوتات" val={sec.antiBot} set={() => setSec({...sec, antiBot: !sec.antiBot})} />
            </div>
            <button onClick={saveSecurity} style={saveBtnStyle}>حفظ الإعدادات</button>
          </div>
        )}
      </main>
    </div>
  );
}

function Toggle({ title, val, set }) {
  return (
    <div onClick={set} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#1e1f22', borderRadius: '8px', cursor: 'pointer' }}>
      <span>{title}</span>
      <span style={{ color: val ? '#23a559' : '#ed4245' }}>{val ? 'ON' : 'OFF'}</span>
    </div>
  );
}

const btnStyle = (active) => ({ width: '100%', padding: '12px', backgroundColor: active ? '#3f4147' : 'transparent', color: 'white', border: 'none', textAlign: 'right', borderRadius: '5px', cursor: 'pointer', marginBottom: '5px' });
const saveBtnStyle = { width: '100%', padding: '15px', backgroundColor: '#5865f2', color: 'white', border: 'none', borderRadius: '8px', marginTop: '25px', cursor: 'pointer', fontWeight: 'bold' };
