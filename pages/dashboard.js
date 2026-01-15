import { useState } from 'react';
import { useSession } from "next-auth/react";

export default function CleanDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('main');

  if (!session) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>يرجى تسجيل الدخول...</div>;

  return (
    <div style={{display:'flex', height:'100vh', backgroundColor:'#1e1f22', direction:'rtl'}}>
      {/* القائمة الجانبية */}
      <aside style={{width:'280px', backgroundColor:'#2b2d31', borderLeft:'1px solid #1e1f22', padding:'10px'}}>
        <div style={{color:'white', fontWeight:'bold', padding:'20px', textAlign:'center'}}>ii3RwA Store</div>
        <div style={{marginTop:'20px'}}>
          <p style={{color:'#80848e', fontSize:'11px', padding:'0 10px'}}>عام</p>
          <button onClick={() => setActiveTab('main')} style={tabStyle}>⚙️ الإعدادات الأساسية</button>
        </div>
      </aside>

      {/* المحتوى */}
      <main style={{flex:1, padding:'40px', color:'white'}}>
         <h1>مرحباً بك في لوحة التحكم</h1>
         <p>هذه هي البداية الجديدة للمشروع.</p>
      </main>
    </div>
  );
}

const tabStyle = { width:'100%', padding:'12px', background:'none', border:'none', color:'#949ba4', textAlign:'right', cursor:'pointer', borderRadius:'5px' };
