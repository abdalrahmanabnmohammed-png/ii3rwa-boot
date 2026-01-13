import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session])

  return (
    <div style={{ backgroundColor: '#23272a', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>ii3rwa Control Panel 🛡️</h1>
      <button onClick={() => signIn('discord')} style={{ padding: '15px 30px', backgroundColor: '#5865F2', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' }}>
        تسجيل الدخول عبر ديسكورد
      </button>
    </div>
  )
}
