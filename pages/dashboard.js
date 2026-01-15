import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('tickets');
  const [settings, setSettings] = useState({
    ticketTitle: '', ticketDescription: '', ticketColor: '#5865f2',
    ticketCategory: '', ticketSupportRole: '', welcomeChannel: ''
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(prev => ({...prev, ...data})));
  }, []);

  const save = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    alert('✅ تم الحفظ! اذهب لديسكورد واكتب #setup-tickets');
  };

  if (!session) return <p style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول</p>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1e1f22', color: 'white', direction: 'rtl', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '250px', backgroundColor: '#2b2d31', padding: '20px', borderLeft: '1px solid #1e1f22' }}>
        <h2 style={{color:'#5865f2'}}>لوحة التحكم</h2>
        <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? activeBtn : navBtn}>🎫 التذاكر</button>
        <button onClick={() => setActiveTab('general')} style={activeTab === 'general' ? activeBtn : navBtn}>⚙️ إعدادات عامة</button>
        <button onClick={save} style={saveBtn}>حفظ الإعدادات</button>
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        <div style={{ backgroundColor: '#2b2d31', padding: '30px', borderRadius: '10px' }}>
          {activeTab === 'tickets' && (
            <>
              <h3>🎫 إعدادات التذاكر (عبر الـ ID)</h3>
              
              <label>ID فئة التذاكر (Category ID):</label>
              <input style={inputStyle} value={settings.ticketCategory} onChange={e => setSettings({...settings, ticketCategory: e.target.value})} placeholder="مثال: 112233445566" />

              <label>ID رتبة الدعم (المنشن):</label>
              <input style={inputStyle} value={settings.ticketSupportRole} onChange={e => setSettings({...settings, ticketSupportRole: e.target.value})} placeholder="مثال: 998877665544" />

              <label>عنوان رسالة المنشور:</label>
              <input style={inputStyle} value={settings.ticketTitle} onChange={e => setSettings({...settings, ticketTitle: e.target.value})} />
              
              <label>لون الرسالة (Hex):</label>
              <input type="color" style={{...inputStyle, height:'40px'}} value={settings.ticketColor} onChange={e => setSettings({...settings, ticketColor: e.target.value})} />
            </>
          )}

          {activeTab === 'general' && (
            <>
              <h3>⚙️ الإعدادات العامة</h3>
              <label>ID قناة الترحيب:</label>
              <input style={inputStyle} value={settings.welcomeChannel} onChange={e => setSettings({...settings, welcomeChannel: e.target.value})} placeholder="أدخل ID القناة هنا" />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const navBtn = { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#b9bbbe', textAlign: 'right', cursor: 'pointer' };
const activeBtn = { ...navBtn, backgroundColor: '#3f4147', color: 'white', borderRadius: '5px' };
const saveBtn = { width: '100%', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '12px', backgroundColor: '#1e1f22', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px', marginBottom: '20px' };
