import { signIn, signOut, useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div style={{ 
      backgroundColor: '#23272a', 
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'sans-serif' 
    }}>
      <h1>لوحة تحكم بوت ii3rwa 🛡️</h1>
      {!session ? (
        <button 
          onClick={() => signIn('discord')}
          style={{ padding: '15px 30px', backgroundColor: '#5865F2', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}
        >
          تسجيل الدخول عبر ديسكورد
        </button>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p>مرحباً، {session.user.name}</p>
          <img src={session.user.image} style={{ borderRadius: '50%', width: '100px' }} />
          <br />
          <button onClick={() => signOut()} style={{ marginTop: '20px', color: 'red', cursor: 'pointer', background: 'none', border: '1px solid red', padding: '5px' }}>
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  )
}
