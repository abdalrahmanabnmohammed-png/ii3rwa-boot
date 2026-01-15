import React, { useState } from 'react';

export default function EmbedCreator() {
  const [embedData, setEmbedData] = useState({
    name: 'new embed', content: '', author: '', authorUrl: '',
    title: '', description: '', footer: '', color: '#5865f2'
  });

  return (
    <div style={styles.container}>
      {/* الرأس - Header */}
      <div style={styles.header}>
        <button style={styles.sendBtn}>إرسال رسالة جديدة</button>
        <div style={styles.headerMore}>...</div>
      </div>

      <div style={styles.editorCard}>
        {/* قسم الاسم ومحتوى الرسالة */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>الإسم</label>
          <input 
            style={styles.mainInput} 
            value={embedData.name} 
            onChange={(e) => setEmbedData({...embedData, name: e.target.value})}
          />
        </div>

        <div style={styles.typeToggle}>
          <button style={styles.toggleBtnActive}>ايمبد</button>
          <button style={styles.toggleBtn}>الرسالة</button>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>محتوى الرسالة</label>
          <textarea style={styles.textarea} />
        </div>

        {/* منطقة منشئ الإيمبد (المعاينة والحقول) */}
        <div style={styles.embedCreatorGrid}>
          {/* الجانب الأيمن: حقول الإيمبد */}
          <div style={styles.embedFields}>
            <div style={styles.colorPickerRow}>
              <span style={styles.label}>لون</span>
              <div style={styles.colorDots}>
                {['#5865f2', '#57f287', '#fee75c', '#eb459e', '#ed4245'].map(c => (
                  <div 
                    key={c} 
                    style={{...styles.colorDot, backgroundColor: c}} 
                    onClick={() => setEmbedData({...embedData, color: c})}
                  />
                ))}
              </div>
            </div>

            <div style={styles.row}>
              <input style={styles.smallInput} placeholder="الرابط" />
              <input style={styles.smallInput} placeholder="الإسم" />
            </div>

            <input style={styles.mainInput} placeholder="عنوان" />
            <textarea style={styles.embedTextarea} placeholder="وصف حلو" />
            
            <button style={styles.addFieldBtn}>أضف حقل</button>

            <div style={styles.imagePlaceholder}>🖼️</div>
            <input style={styles.mainInput} placeholder="ذيل" />
          </div>

          {/* الجانب الأيسر: أيقونة المؤلف */}
          <div style={styles.authorSection}>
            <div style={styles.authorCircle}>👤</div>
          </div>
        </div>
      </div>

      <div style={styles.noResponses}>
        <p>No responses, create the first response</p>
        <button style={styles.addResponseBtn}>إضافة رد تلقائي</button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', backgroundColor: '#1e1f22', minHeight: '100vh', direction: 'rtl', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  sendBtn: { backgroundColor: '#35373c', color: '#5865f2', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  headerMore: { color: '#949ba4', cursor: 'pointer' },
  editorCard: { backgroundColor: '#2b2d31', borderRadius: '8px', padding: '25px', border: '1px solid #383a40' },
  label: { display: 'block', color: '#949ba4', fontSize: '12px', marginBottom: '8px', textAlign: 'left' },
  mainInput: { width: '100%', backgroundColor: '#1e1f22', border: '1px solid #111', borderRadius: '4px', padding: '10px', color: '#fff', marginBottom: '15px' },
  typeToggle: { display: 'flex', justifyContent: 'flex-end', gap: '5px', marginBottom: '10px' },
  toggleBtn: { backgroundColor: '#35373c', border: 'none', color: '#949ba4', padding: '5px 15px', borderRadius: '4px' },
  toggleBtnActive: { backgroundColor: '#5865f2', border: 'none', color: '#fff', padding: '5px 15px', borderRadius: '4px' },
  textarea: { width: '100%', height: '80px', backgroundColor: '#1e1f22', border: '1px solid #111', borderRadius: '4px', color: '#fff', resize: 'none' },
  embedCreatorGrid: { display: 'flex', gap: '20px', marginTop: '20px', padding: '20px', backgroundColor: '#232428', borderRadius: '8px' },
  embedFields: { flex: 1 },
  authorSection: { width: '60px' },
  authorCircle: { width: '50px', height: '50px', border: '2px dashed #4e5058', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4e5058' },
  colorPickerRow: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginBottom: '15px' },
  colorDots: { display: 'flex', gap: '5px' },
  colorDot: { width: '12px', height: '12px', borderRadius: '50%', cursor: 'pointer' },
  row: { display: 'flex', gap: '10px', marginBottom: '10px' },
  smallInput: { flex: 1, backgroundColor: '#1e1f22', border: '1px solid #111', padding: '8px', borderRadius: '4px', color: '#fff' },
  embedTextarea: { width: '100%', height: '100px', backgroundColor: '#1e1f22', border: '1px solid #111', borderRadius: '4px', padding: '10px', color: '#fff', marginBottom: '10px' },
  addFieldBtn: { backgroundColor: '#5865f2', border: 'none', color: '#fff', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px' },
  imagePlaceholder: { width: '100%', height: '80px', border: '2px dashed #4e5058', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' },
  noResponses: { textAlign: 'center', marginTop: '40px', color: '#4e5058' },
  addResponseBtn: { backgroundColor: '#35373c', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '4px', marginTop: '10px', cursor: 'pointer' }
};
