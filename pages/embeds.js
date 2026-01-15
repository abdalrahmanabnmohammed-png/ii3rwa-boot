import React, { useState } from 'react';

export default function EmbedMessages() {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) return (
    <div style={{color:'white'}}>
      <button onClick={() => setIsCreating(false)} style={{color:'#949ba4', background:'none', border:'none', cursor:'pointer', marginBottom:'20px'}}>← العودة</button>
      <div style={{backgroundColor:'#2b2d31', padding:'30px', borderRadius:'8px', border:'1px solid #383a40'}}>
        <label style={{display:'block', color:'#949ba4', marginBottom:'10px'}}>الإسم</label>
        <input style={{width:'100%', backgroundColor:'#1e1f22', border:'1px solid #111', padding:'10px', color:'white', borderRadius:'4px', marginBottom:'20px'}} defaultValue="new embed" />
        <div style={{display:'flex', backgroundColor:'#232428', padding:'20px', borderRadius:'8px', gap:'20px'}}>
           <div style={{flex:1}}>
              <div style={{display:'flex', justifyContent:'flex-end', gap:'5px', marginBottom:'15px'}}>
                {['#5865f2', '#57f287', '#fee75c', '#ed4245'].map(c => <div key={c} style={{width:'12px', height:'12px', borderRadius:'50%', backgroundColor:c}} />)}
              </div>
              <input style={subInput} placeholder="العنوان" />
              <textarea style={{...subInput, height:'100px', resize:'none'}} placeholder="وصف الرسالة..." />
              <button style={{backgroundColor:'#5865f2', border:'none', color:'white', padding:'8px 15px', borderRadius:'4px'}}>إرسال الرسالة</button>
           </div>
           <div style={{width:'50px', height:'50px', border:'2px dashed #4e5058', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center'}}>👤</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{color:'white'}}>
      <h2 style={{marginBottom:'30px'}}>رسائل الإيمبد</h2>
      <div style={{backgroundColor:'#2b2d31', padding:'40px', borderRadius:'12px', border:'1px solid #383a40'}}>
        <label style={{color:'#949ba4', display:'block', marginBottom:'10px'}}>البحث باستخدام اسم الايمبد</label>
        <input style={{width:'100%', padding:'12px', backgroundColor:'#1e1f22', border:'1px solid #111', borderRadius:'5px', color:'white', marginBottom:'30px'}} placeholder="الإسم" />
        <div style={{border:'2px dashed #383a40', padding:'30px', textAlign:'center', cursor:'pointer', color:'#949ba4'}} onClick={() => setIsCreating(true)}>
           <span>+ إنشاء ايمبد!</span>
        </div>
      </div>
    </div>
  );
}

const subInput = { width:'100%', backgroundColor:'#1e1f22', border:'1px solid #111', padding:'10px', color:'white', borderRadius:'4px', marginBottom:'15px' };
