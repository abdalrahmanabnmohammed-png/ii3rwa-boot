// أضف هذه الحالة داخل الدالة CleanDashboard
const [reasons, setReasons] = useState([]);
const [newReason, setNewReason] = useState('');

// تحديث دالة useEffect لجلب الأسباب أيضاً
useEffect(() => {
  fetch('/api/commands').then(res => res.json()).then(data => {
    if (data) {
      setCmdNames(data);
      setReasons(data.banReasons || []);
    }
  });
}, []);

// دالة لإضافة سبب جديد
const addReason = () => {
  if (newReason.trim()) {
    const updated = [...reasons, newReason];
    setReasons(updated);
    setNewReason('');
  }
};

// تحديث دالة الحفظ لتشمل الأسباب
const saveCommands = async () => {
  await fetch('/api/commands', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...cmdNames, banReasons: reasons }),
  });
  alert('✅ تم حفظ الإعدادات بنجاح!');
};

// داخل قسم activeTab === 'cmds'، أضف هذا الجزء تحت مدخلات الأسماء:
<div style={{ marginTop: '30px', borderTop: '1px solid #3f4147', paddingTop: '20px' }}>
  <h4>📋 قائمة أسباب الحظر</h4>
  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
    <input 
      style={styles.input} 
      placeholder="أضف سبباً جديداً (مثل: سبام)" 
      value={newReason} 
      onChange={e => setNewReason(e.target.value)} 
    />
    <button onClick={addReason} style={{ padding: '0 20px', backgroundColor: '#5865f2', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>أضف</button>
  </div>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
    {reasons.map((r, i) => (
      <div key={i} style={{ backgroundColor: '#1e1f22', padding: '5px 15px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>{r}</span>
        <span onClick={() => setReasons(reasons.filter((_, idx) => idx !== i))} style={{ color: '#ed4245', cursor: 'pointer', fontWeight: 'bold' }}>×</span>
      </div>
    ))}
  </div>
</div>
