import { useState } from 'react';

export default function SecurityTab() {
  const [config, setConfig] = useState({ antiLink: false, antiSpam: false, antiBadWords: false });

  return (
    <div style={{color:'white'}}>
      <h2 style={{marginBottom:'20px'}}>🛡️ إعدادات الحماية</h2>
      <div style={{backgroundColor:'#2b2d31', padding:'30px', borderRadius:'10px', border:'1px solid #383a40'}}>
        <ToggleItem title="حماية من الروابط" active={config.antiLink} onToggle={() => setConfig({...config, antiLink: !config.antiLink})} />
        <ToggleItem title="حماية من السبام" active={config.antiSpam} onToggle={() => setConfig({...config, antiSpam: !config.antiSpam})} />
        <ToggleItem title="فلتر الكلمات (+18)" active={config.antiBadWords} onToggle={() => setConfig({...config, antiBadWords: !config.antiBadWords})} />
        <button style={saveBtn}>حفظ التغييرات</button>
      </div>
    </div>
  );
}

function ToggleItem({ title, active, onToggle }) {
  return (
    <div style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid #3f4147'}}>
      <span>{title}</span>
      <div onClick={onToggle} style={{width:'40px', height:'20px', backgroundColor: active ? '#23a559' : '#80848e', borderRadius:'10px', cursor:'pointer', position:'relative', transition:'0.3s'}}>
        <div style={{width:'16px', height:'16px', backgroundColor:'white', borderRadius:'50%', position:'absolute', top:'2px', right: active ? '22px' : '2px', transition:'0.3s'}} />
      </div>
    </div>
  );
}
const saveBtn = { width:'100%', padding:'12px', backgroundColor:'#5865f2', color:'white', border:'none', borderRadius:'5px', marginTop:'20px', fontWeight:'bold', cursor:'pointer' };
