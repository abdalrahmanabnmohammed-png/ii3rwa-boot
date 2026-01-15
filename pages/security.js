import { useState, useEffect } from 'react';

export default function SecurityTab() {
  const [config, setConfig] = useState({
    antiLink: false, antiSpam: false, antiBadWords: false, antiFake: false, minAccountAge: 7
  });

  const toggle = (key) => setConfig({...config, [key]: !config[key]});

  const saveConfig = async () => {
    await fetch('/api/save-security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    alert("✅ تم حفظ إعدادات الحماية");
  };

  return (
    <div style={{color:'white', padding:'20px'}}>
      <h2 style={{marginBottom:'25px'}}>🛡️ نظام الحماية (Security)</h2>
      
      <div style={styles.card}>
        <SecurityItem 
          title="مانع الروابط (Anti-Links)" 
          desc="حذف الروابط التي يتم إرسالها من قبل الأعضاء" 
          active={config.antiLink} 
          onToggle={() => toggle('antiLink')} 
        />
        <SecurityItem 
          title="مانع السبام (Anti-Spam)" 
          desc="منع تكرار الرسائل بسرعة كبيرة" 
          active={config.antiSpam} 
          onToggle={() => toggle('antiSpam')} 
        />
        <SecurityItem 
          title="فلتر الكلمات (+18)" 
          desc="حذف الرسائل التي تحتوي على كلمات بذيئة" 
          active={config.antiBadWords} 
          onToggle={() => toggle('antiBadWords')} 
        />
        <SecurityItem 
          title="منع الحسابات الوهمية" 
          desc="طرد الأعضاء الذين عمر حساباتهم أقل من الحد المطلوب" 
          active={config.antiFake} 
          onToggle={() => toggle('antiFake')} 
        />
        
        {config.antiFake && (
          <div style={{marginTop:'15px', padding:'15px', backgroundColor:'#1e1f22', borderRadius:'5px'}}>
            <label style={{fontSize:'12px', color:'#949ba4'}}>عمر الحساب بالأيام:</label>
            <input 
              type="number" 
              style={styles.input} 
              value={config.minAccountAge} 
              onChange={(e) => setConfig({...config, minAccountAge: e.target.value})} 
            />
          </div>
        )}

        <button onClick={saveConfig} style={styles.saveBtn}>حفظ الإعدادات</button>
      </div>
    </div>
  );
}

function SecurityItem({ title, desc, active, onToggle }) {
  return (
    <div style={styles.item}>
      <div>
        <div style={{fontWeight:'bold'}}>{title}</div>
        <div style={{fontSize:'12px', color:'#949ba4'}}>{desc}</div>
      </div>
      <div 
        onClick={onToggle} 
        style={{...styles.switch, backgroundColor: active ? '#23a559' : '#80848e'}}
      >
        <div style={{...styles.dot, transform: active ? 'translateX(-20px)' : 'translateX(0)'}} />
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor:'#2b2d31', padding:'25px', borderRadius:'10px', border:'1px solid #383a40' },
  item: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 0', borderBottom:'1px solid #3f4147' },
  switch: { width:'45px', height:'22px', borderRadius:'15px', padding:'2px', cursor:'pointer', transition:'0.3s' },
  dot: { width:'18px', height:'18px', backgroundColor:'white', borderRadius:'50%', transition:'0.3s' },
  saveBtn: { marginTop:'25px', width:'100%', padding:'12px', backgroundColor:'#5865f2', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold' },
  input: { width:'100%', background:'transparent', border:'1px solid #3f4147', color:'white', padding:'8px', marginTop:'5px' }
};
