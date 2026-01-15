import React from 'react';

export default function EmbedCreator() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.sendBtn}>إرسال رسالة جديدة</button>
      </div>

      <div style={styles.card}>
        <label style={styles.label}>الإسم</label>
        <input style={styles.input} defaultValue="new embed" />

        <div style={styles.toggleRow}>
          <button style={styles.activeBtn}>ايمبد</button>
          <button style={styles.ghostBtn}>الرسالة</button>
        </div>

        <label style={styles.label}>محتوى الرسالة</label>
        <textarea style={styles.textarea}></textarea>

        {/* صندوق المعاينة (نفس الصورة الرابعة) */}
        <div style={styles.previewBox}>
          <div style={styles.authorSide}><div style={styles.dashedCircle}>👤</div></div>
          <div style={styles.fieldsSide}>
            <div style={styles.colorRow}>
              <span>اللون</span>
              <div style={styles.dots}>
                {['#5865f2', '#57f287', '#fee75c', '#eb459e', '#ed4245'].map(c => (
                  <div key={c} style={{width:'12px', height:'12px', borderRadius:'50%', backgroundColor:c}} />
                ))}
              </div>
            </div>
            <div style={{display:'flex', gap:'10px'}}><input style={styles.subInput} placeholder="الرابط" /><input style={styles.subInput} placeholder="الإسم" /></div>
            <input style={styles.subInput} placeholder="عنوان" />
            <textarea style={{...styles.subInput, height:'80px'}} placeholder="وصف حلو"></textarea>
            <button style={styles.blueBtn}>أضف حقل</button>
            <div style={styles.dashedRect}>🖼️</div>
            <input style={styles.subInput} placeholder="ذيل" />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', color: 'white' },
  header: { display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' },
  sendBtn: { backgroundColor: '#4e5058', color: '#5865f2', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  card: { backgroundColor: '#2b2d31', padding: '30px', borderRadius: '8px', border: '1px solid #383a40' },
  label: { display: 'block', color: '#949ba4', fontSize: '12px', marginBottom: '8px' },
  input: { width: '100%', backgroundColor: '#1e1f22', border: '1px solid #111', padding: '10px', color: 'white', borderRadius: '4px', marginBottom: '20px' },
  toggleRow: { display: 'flex', justifyContent: 'flex-end', gap: '5px', marginBottom: '10px' },
  activeBtn: { backgroundColor: '#5865f2', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '4px' },
  ghostBtn: { backgroundColor: '#35373c', border: 'none', color: '#949ba4', padding: '5px 15px', borderRadius: '4px' },
  textarea: { width: '100%', height: '100px', backgroundColor: '#1e1f22', border: '1px solid #111', borderRadius: '4px', color: 'white' },
  previewBox: { display: 'flex', backgroundColor: '#232428', borderRadius: '8px', padding: '20px', gap: '20px', marginTop: '20px' },
  authorSide: { width: '50px' },
  dashedCircle: { width: '45px', height: '45px', border: '2px dashed #4e5058', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4e5058' },
  fieldsSide: { flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' },
  colorRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'center' },
  dots: { display: 'flex', gap: '5px' },
  subInput: { width: '100%', backgroundColor: '#1e1f22', border: '1px solid #111', padding: '10px', color: 'white', borderRadius: '4px' },
  blueBtn: { backgroundColor: '#5865f2', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', alignSelf: 'flex-start' },
  dashedRect: { width: '100%', height: '80px', border: '2px dashed #4e5058', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};
