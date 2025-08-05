import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SupabaseLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error)
    } else {
      router.push('/health-tracker')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f7f7f9' }}>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32, minWidth: 320, maxWidth: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#2c3e50' }}>Health Tracker Login</h2>
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} onSubmit={e => { e.preventDefault(); handleLogin(); }}>
          <div style={{ marginBottom: 18, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, width: '100%', maxWidth: 320 }}>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', maxWidth: 320, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: 18, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, width: '100%', maxWidth: 320 }}>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', maxWidth: 320, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', maxWidth: 320, padding: '10px 0', borderRadius: 6, background: '#3498db', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16, cursor: 'pointer' }}>Login</button>
        </form>
        {error && <p style={{ marginTop: 18, textAlign: 'center', color: 'red' }}>{error}</p>}
      </div>
    </div>
  )
}
