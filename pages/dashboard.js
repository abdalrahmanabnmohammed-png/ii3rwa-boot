import { useState } from 'react';
import { useSession } from "next-auth/react";
import SecurityTab from './security';
import AutoReply from './auto-reply'; // 1. استدعاء الصفحة الجديدة

export default function CleanDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('main');

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول...</div>;

  return (
    <div style={{display:'flex', height:'100vh', backgroundColor:'#1e1f22', direction:'rtl'}}>
      
      <aside style={{width:'280px', backgroundColor:'#2b2d31', borderLeft:'1px solid #1e1f22', padding:'10px'}}>
        <div style={{color:'white', fontWeight:'bold', padding:'20px', textAlign:'center', fontSize:'20px'}}>ii3RwA Store</div>
        
        <div style={{marginTop:'20px'}}>
          <p style={sectionTitle}>عام</p>
          <button onClick={() => setActiveTab('main')} style={activeTab === 'main' ? activeTabStyle : tabStyle}>⚙️ الإعدادات الأساسية</button>
          
          <p style={sectionTitle}>الخصائص</p>
          <button onClick={() => setActiveTab('security')} style={activeTab === 'security' ? activeTabStyle : tabStyle}>🛡️ نظام الحماية</button>
          {/* 2. إضافة الزر الجديد */}
          <button onClick={() => setActiveTab('autoreply')} style={activeTab === 'autoreply' ? activeTabStyle : tabStyle}>💬 الرد التلقائي</button>
        </div>
      </aside>

      <main style={{flex:1, padding:'40px', color:'white', overflowY:'auto'}}>
         {activeTab === 'main' && (
           <div>
              <h1>مرحباً بك، {session.user.name}</h1>
              <p>اختر قسماً من القائمة الجانبية للبدء.</p>
           </div>
         )}

         {activeTab === 'security' && <SecurityTab />}
         
         {/* 3. عرض صفحة الرد التلقائي عند الضغط على الزر */}
         {activeTab === 'autoreply' && <AutoReply />}
      </main>
    </div>
  );
}

const sectionTitle = { color:'#80848e', fontSize:'11px', padding:'0 10px', marginTop:'20px', marginBottom:'10px' };
const tabStyle = { width:'100%', padding:'12px', background:'none', border:'none', color:'#949ba4', textAlign:'right', cursor:'pointer', borderRadius:'5px', marginBottom:'5px' };
const activeTabStyle = { ...tabStyle, backgroundColor:'#3f4147', color:'white', fontWeight:'bold' };
