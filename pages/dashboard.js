import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import SecurityTab from './security'; // استدعاء صفحة الحماية

export default function CleanDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('main'); // الصفحة الافتراضية

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول...</div>;

  return (
    <div style={{display:'flex', height:'100vh', backgroundColor:'#1e1f22', direction:'rtl'}}>
      
      {/* القائمة الجانبية (Sidebar) */}
      <aside style={{width:'280px', backgroundColor:'#2b2d31', borderLeft:'1px solid #1e1f22', padding:'10px'}}>
        <div style={{color:'white', fontWeight:'bold', padding:'20px', textAlign:'center', fontSize:'20px'}}>ii3RwA Store</div>
        
        <div style={{marginTop:'20px'}}>
          <p style={{color:'#80848e', fontSize:'11px', padding:'0 10px', marginBottom:'10px'}}>عام</p>
          <button onClick={() => setActiveTab('main')} style={activeTab === 'main' ? activeTabStyle : tabStyle}>⚙️ الإعدادات الأساسية</button>
          
          <p style={{color:'#80848e', fontSize:'11px', padding:'0 10px', marginTop:'20px', marginBottom:'10px'}}>الحماية</p>
          <button onClick={() => setActiveTab('security')} style={activeTab === 'security' ? activeTabStyle : tabStyle}>🛡️ نظام الحماية</button>
        </div>
      </aside>

      {/* المحتوى (المكان الذي تظهر فيه الصفحات) */}
      <main style={{flex:1, padding:'40px', color:'white', overflowY:'auto'}}>
         
         {/* إذا كان المجلد النشط هو "main" */}
         {activeTab === 'main' && (
           <div>
              <h1>مرحباً بك، {session.user.name}</h1>
              <p style={{color:'#949ba4'}}>هذه هي البداية الجديدة للمشروع. اختر قسماً من القائمة الجانبية للبدء.</p>
           </div>
         )}

         {/* إذا ضغطت على زر الحماية، تظهر صفحة الحماية هنا */}
         {activeTab === 'security' && <SecurityTab />}

      </main>
    </div>
  );
}

// تنسيق الأزرار العادية
const tabStyle = { 
  width:'100%', padding:'12px', background:'none', border:'none', 
  color:'#949ba4', textAlign:'right', cursor:'pointer', borderRadius:'5px', 
  transition:'0.2s', marginBottom:'5px' 
};

// تنسيق الزر عند الضغط عليه (Active)
const activeTabStyle = { 
  ...tabStyle, 
  backgroundColor:'#3f4147', color:'white', fontWeight:'bold' 
};
