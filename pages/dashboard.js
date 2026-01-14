import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";

export default function ProDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState({
    youtubeChannelId: '', antiLinks: true, welcomeMsg: '', logChannel: '',
    enableBan: true, banShortcut: '#حظر', clearShortcut: '#مسح'
  });

  // التنقل بين الأقسام الجانبية
  const menuGroups = [
    { title: 'عام', items: [
      { id: 'overview', name: 'نظرة عامة', icon: '👁️' },
      { id: 'settings', name: 'إعدادات السيرفر', icon: '⚙️' },
      { id: 'embed', name: 'رسائل الإيمبد', icon: '📑' }
    ]},
    { title: 'قائمة الخصائص', items: [
      { id: 'commands', name: 'الأوامر العامة', icon: '⚙️', active: true },
      { id: 'welcome', name: 'الترحيب & المغادرة', icon: '✋', active: true },
      { id: 'auto-reply', name: 'الرد التلقائي', icon: '✉️', active: true },
      { id: 'levels', name: 'نظام اللفلات', icon: '📊', active: true }
    ]},
    { title: 'الإشراف', items: [
      { id: 'mod', name: 'الإشراف', icon: '⚖️', active: true },
      { id: 'logs', name: 'اللوق', icon: '📜', active: true },
      { id: 'protection', name: 'الرقابة التلقائية', icon: '🤖', active: true }
    ]},
    { title: 'الإشعارات', items: [
      { id: 'youtube', name: 'يوتيوب', icon: '🎬', active: true, premium: true },
      { id: 'twitch', name: 'تويتش', icon: '📽️', active: true, premium: true }
    ]}
  ];

  if (!session) return <div style={{backgroundColor:'#1e1f22', height:'100vh'}}></div>;

  return (
    <div style={styles.container}>
      {/* القائمة الجانبية المطابقة للصور */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img src={session.user.image} style={styles.userAvatar} />
          <span>{session.user.name}</span>
        </div>
        
        <div style={styles.scrollArea}>
          {menuGroups.map(group => (
            <div key={group.title} style={styles.menuGroup}>
              <p style={styles.groupTitle}>{group.title}</p>
              {group.items.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)}
                  style={activeTab === item.id ? styles.navItemActive : styles.navItem}
                >
                  <span style={{marginRight:'10px'}}>{item.icon}</span>
                  <span style={{flex: 1}}>{item.name}</span>
                  {item.active && <div style={styles.statusDot} />}
                  {item.premium && <span style={styles.premiumTag}>بريميوم</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* منطقة العمل الرئيسية */}
      <div style={styles.mainContent}>
        <div style={styles.contentHeader}>
          <h2>{activeTab.toUpperCase()}</h2>
          <button style={styles.saveBtn} onClick={() => alert('✅ تم الحفظ')}>حفظ التغييرات</button>
        </div>

        {activeTab === 'mod' && (
          <div style={styles.card}>
            <h3>إعدادات الإشراف (Mod)</h3>
            <div style={styles.inputGroup}>
              <label>اختصار أمر الحظر:</label>
              <input style={styles.input} value={settings.banShortcut} onChange={e => setSettings({...settings, banShortcut: e.target.value})} />
            </div>
            <div style={styles.switchRow}>
              <span>تفعيل نظام الحظر الذكي</span>
              <input type="checkbox" checked={settings.enableBan} />
            </div>
          </div>
        )}

        {activeTab === 'youtube' && (
          <div style={styles.card}>
            <h3>إشعارات اليوتيوب 🎬</h3>
            <label>معرف القناة:</label>
            <input style={styles.input} value={settings.youtubeChannelId} placeholder="UCxxxxx" />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#1e1f22', color: '#dbdee1', fontFamily: 'sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#2b2d31', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1e1f22' },
  sidebarHeader: { padding: '20px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#232428' },
  userAvatar: { width: '32px', height: '32px', borderRadius: '50%' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '10px' },
  menuGroup: { marginBottom: '20px' },
  groupTitle: { fontSize: '12px', color: '#949ba4', fontWeight: 'bold', padding: '0 10px 5px' },
  navItem: { display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', transition: '0.2s' },
  navItemActive: { display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '5px', backgroundColor: '#3f4147', color: 'white', fontSize: '14px' },
  statusDot: { width: '8px', height: '8px', backgroundColor: '#23a559', borderRadius: '50%', marginLeft: '5px' },
  premiumTag: { fontSize: '10px', backgroundColor: '#f0b232', color: 'black', padding: '2px 5px', borderRadius: '3px', marginLeft: '5px' },
  mainContent: { flex: 1, padding: '40px', overflowY: 'auto' },
  contentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  saveBtn: { backgroundColor: '#5865f2', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  card: { backgroundColor: '#2b2d31', padding: '20px', borderRadius: '8px' },
  input: { width: '100%', padding: '12px', backgroundColor: '#1e1f22', border: 'none', color: 'white', borderRadius: '5px', marginTop: '10px' },
  switchRow: { display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #3f4147' }
};
