import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic'; // حل مشكلة الرسوم البيانية في السيرفر

// استيراد صفحة النظرة العامة بشكل ديناميكي لتجنب أخطاء الـ Build
const Overview = dynamic(() => import('./overview'), { ssr: false });

export default function ProDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    antiLink: false, youtubeChannel: '', welcomeChannel: '',
    infoTitle: '', infoDescription: '', ticketReasons: '',
    ticketCategory: '', ticketSupportRole: '', logChannel: '',
    msgWelcome: '', msgClaim: '', msgUnclaim: ''
  });

  useEffect(() => {
    // جلب الإعدادات بأمان
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data) setSettings({ ...data, ticketReasons: data.ticketReasons?.join(', ') || '' });
      } catch (err) {
        console.error("فشل جلب الإعدادات");
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const reasons = settings.ticketReasons.split(',').map(r => r.trim()).filter(r => r !== "");
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, ticketReasons: reasons }),
      });
      alert('✅ تم الحفظ بنجاح');
    } catch (e) {
      alert('❌ خطأ في الحفظ');
    }
    setIsSaving(false);
  };

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>جاري التحميل...</div>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>ii3RwA Control</div>
        <nav style={styles.nav}>
          <button onClick={() => setActiveTab('overview')} style={activeTab === 'overview' ? styles.activeNav : styles.navBtn}>👁️ نظرة عامة</button>
          <button onClick={() => setActiveTab('tickets')} style={activeTab === 'tickets' ? styles.activeNav : styles.navBtn}>🎫 التذاكر</button>
          <button onClick={() => setActiveTab('security')} style={activeTab === 'security' ? styles.activeNav : styles.navBtn}>🛡️ الحماية</button>
        </nav>
        <button onClick={saveSettings} style={styles.saveBtn} disabled={isSaving}>
          {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </aside>

      <main style={styles.main}>
        <div style={styles.content}>
          {activeTab === 'overview' ? <Overview /> : (
            <div style={styles.card}>
               {activeTab === 'tickets' ? (
                 <>
                   <h3>إعدادات التذاكر</h3>
                   <input style={styles.input} value={settings.infoTitle} onChange={e => setSettings({...settings, infoTitle: e.target.value})} placeholder="العنوان" />
                   <input style={styles.input} value={settings.ticketReasons} onChange={e => setSettings({...settings, ticketReasons: e.target.value})} placeholder="الأقسام" />
                 </>
               ) : (
                 <>
                   <h3>إعدادات الحماية</h3>
                   <div style={{display:'flex', gap:'10px'}}>
                     <input type="checkbox" checked={settings.antiLink} onChange={e => setSettings({...settings, antiLink: e.target.checked})} />
                     <span>تفعيل مانع الروابط</span>
                   </div>
                 </>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#0f1011', color: 'white', direction: 'rtl' },
  sidebar: { width: '250px', backgroundColor: '#18191c', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #232428' },
  brand: { padding: '25px', fontSize: '20px', fontWeight: 'bold', color: '#5865f2', textAlign: 'center' },
  nav: { flex: 1, padding: '10px' },
  navBtn: { width: '100%', padding: '12px', background: 'none', border: 'none', color: '#949ba4', textAlign: 'right', cursor: 'pointer', borderRadius: '5px' },
  activeNav: { width: '100%', padding: '12px', backgroundColor: '#35373c', color: 'white', textAlign: 'right', borderRadius: '5px', fontWeight: 'bold' },
  main: { flex: 1, padding: '30px' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '10px' },
  input: { width: '100%', padding: '12px', margin: '10px 0', backgroundColor: '#1e1f22', border: 'none', color: 'white', borderRadius: '5px' },
  saveBtn: { margin: '20px', padding: '12px', backgroundColor: '#23a559', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};
