import { useState } from 'react';

export default function AutoReply() {
  const [replies, setReplies] = useState([
    { trigger: 'السلام عليكم', response: 'وعليكم السلام ورحمة الله وبركاته' }
  ]);
  const [newTrigger, setNewTrigger] = useState('');
  const [newResponse, setNewResponse] = useState('');

  const addReply = () => {
    if (newTrigger && newResponse) {
      setReplies([...replies, { trigger: newTrigger, response: newResponse }]);
      setNewTrigger('');
      setNewResponse('');
      alert('✅ تم إضافة الرد بنجاح (سيتم الحفظ عند الضغط على حفظ الكل)');
    }
  };

  return (
    <div style={{color:'white', padding:'20px'}}>
      <h2 style={{marginBottom:'25px'}}>💬 الرد التلقائي (Auto Reply)</h2>
      
      <div style={styles.card}>
        <div style={{marginBottom:'20px'}}>
          <label style={styles.label}>عندما يرسل العضو:</label>
          <input 
            style={styles.input} 
            placeholder="مثال: السلام عليكم" 
            value={newTrigger}
            onChange={(e) => setNewTrigger(e.target.value)}
          />
        </div>
        
        <div style={{marginBottom:'20px'}}>
          <label style={styles.label}>يقوم البوت بالرد بـ:</label>
          <textarea 
            style={{...styles.input, height:'80px'}} 
            placeholder="مثال: وعليكم السلام ورحمة الله وبركاته" 
            value={newResponse}
            onChange={(e) => setNewResponse(e.target.value)}
          />
        </div>

        <button onClick={addReply} style={styles.addBtn}>+ إضافة رد جديد</button>
      </div>

      <div style={{marginTop:'30px'}}>
        <h4 style={{marginBottom:'15px', color:'#949ba4'}}>الردود الحالية:</h4>
        {replies.map((item, index) => (
          <div key={index} style={styles.replyItem}>
            <span>{item.trigger} ⬅️ {item.response}</span>
            <button style={{background:'none', border:'none', color:'#ed4245', cursor:'pointer'}}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor:'#2b2d31', padding:'25px', borderRadius:'10px', border:'1px solid #383a40' },
  label: { display:'block', fontSize:'12px', color:'#949ba4', marginBottom:'8px' },
  input: { width:'100%', backgroundColor:'#1e1f22', border:'1px solid #111', color:'white', padding:'12px', borderRadius:'5px' },
  addBtn: { width:'100%', padding:'12px', backgroundColor:'#23a559', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold' },
  replyItem: { display:'flex', justifyContent:'space-between', backgroundColor:'#2b2d31', padding:'15px', borderRadius:'5px', marginBottom:'10px', border:'1px solid #383a40' }
};
