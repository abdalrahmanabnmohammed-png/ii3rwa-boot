export default function Home() {
  return (
    <div style={{ backgroundColor: '#2c2f33', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial' }}>
      <h1>لوحة تحكم بوت ii3rwa</h1>
      <p>أهلاً بك في نظام الحماية وإشعارات اليوتيوب</p>
      <button style={{ padding: '10px 20px', backgroundColor: '#5865F2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px' }}
        onClick={() => alert('جاري ربط نظام الدخول...')} >
        تسجيل الدخول عبر ديسكورد
      </button>
    </div>
  )
}
