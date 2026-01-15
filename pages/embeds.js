import React, { useState } from 'react';

export default function EmbedMessages() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>رسائل الإيمبد</h2>
      
      <div style={styles.contentCard}>
        {/* قسم البحث */}
        <div style={styles.searchSection}>
          <label style={styles.label}>البحث باستخدام اسم الايمبد</label>
          <div style={styles.inputWrapper}>
            <input 
              style={styles.input} 
              placeholder="الإسم" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.dividerText}>رسائل الإيمبد</div>

        {/* زر إنشاء إيمبد جديد */}
        <div style={styles.createBox} onClick={() => alert('سيتم فتح منشئ الإيمبد قريباً!')}>
          <div style={styles.plusIcon}>+</div>
          <span>إنشاء ايمبد!</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: '30px', 
    backgroundColor: '#313338', 
    minHeight: '100vh', 
    direction: 'rtl', 
    color: 'white' 
  },
  title: { 
    fontSize: '28px', 
    marginBottom: '30px', 
    fontWeight: 'bold',
    textAlign: 'right'
  },
  contentCard: {
    backgroundColor: '#2b2d31',
    borderRadius: '12px',
    padding: '40px',
    border: '1px solid #383a40',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  searchSection: {
    marginBottom: '40px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#949ba4',
    marginBottom: '15px',
    textAlign: 'left' // ليتناسب مع الواجهة في الصورة
  },
  inputWrapper: {
    backgroundColor: '#1e1f22',
    borderRadius: '6px',
    padding: '2px',
    border: '1px solid #111'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    outline: 'none',
    fontSize: '15px',
    textAlign: 'right'
  },
  dividerText: {
    fontSize: '12px',
    color: '#949ba4',
    marginBottom: '20px',
    textAlign: 'left',
    fontWeight: 'bold'
  },
  createBox: {
    border: '2px dashed #383a40',
    borderRadius: '8px',
    padding: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    color: '#949ba4',
    transition: '0.2s',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  plusIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#4e5058',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px'
  }
};
