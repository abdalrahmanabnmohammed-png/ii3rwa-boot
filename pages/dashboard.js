import { useSession, signIn } from "next-auth/react"

export default function Dashboard() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div style={{ backgroundColor: '#23272a', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1>يجب تسجيل الدخول أولاً ⚠️</h1>
        <button onClick={() => signIn('discord')} style={{ padding: '10px 20px', backgroundColor: '#5865F2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>دخول</button>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#2c2f33', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'Arial' }}>
      <h2>مرحباً، {session.user.name} 👋</h2>
      <div style={{ backgroundColor: '#23272a', padding: '20px', borderRadius: '10px', marginTop: '20px', maxWidth: '600px' }}>
        <h3>⚙️ إعدادات اليوتيوب</h3>
        <label>ID قناة اليوتيوب:</label><br/>
        <input type="text" placeholder="مثال: UCxxxx..." style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' }} /><br/>
        
        <h3>🛡️ نظام الحماية</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>منع الروابط (Anti-Links)</span>
          <input type="checkbox" style={{ transform: 'scale(1.5)' }} />
        </div>
        <br/>
        <button style={{ width: '100%', padding: '15px', backgroundColor: '#43b581', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>حفظ الإعدادات</button>
      </div>
    </div>
  )
}
