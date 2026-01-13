import { signIn, signOut, useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div style={{ backgroundColor: '#23272a', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI' }}>
      <h1>لوحة تحكم بوت ii3rwa 🛡️</h1>
      {!session ? (
        <>
          <p>يجب تسجيل الدخول للتحكم في الحماية واليوتيوب</p>
          <button onClick={() => signIn('discord')} style={{ padding: '12px 24px', backgroundColor: '#5865F2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            تسجيل الدخول عبر ديسكورد
          </button>
        </>
      ) : (
        <>
          <p>مرحباً بك، {session.user.name}</p>
          <button onClick={() => signOut()} style={{ padding: '8px 16px', backgroundColor: '#ed4245', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            تسجيل الخروج
          </button>
        </>
      )}
    </div>
  )
}
