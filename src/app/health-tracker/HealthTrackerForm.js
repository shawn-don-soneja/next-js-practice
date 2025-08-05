"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HealthTrackerForm(){
  const [bloodSugar, setBloodSugar] = useState('')
  const [weight, setWeight] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!bloodSugar || !weight) {
      setMessage('Please enter both blood sugar and weight.')
      return
    }
    try {
      const res = await fetch('/api/submitHealthData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bloodSugar, weight })
      })
      if (res.ok) {
        setMessage('Data submitted successfully!')
        setBloodSugar('')
        setWeight('')
      } else {
        setMessage('Failed to submit data.')
      }
    } catch (err) {
      setMessage('Error submitting data.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f7f7f9' }}>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32, minWidth: 320, maxWidth: 400 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 24, color: '#2c3e50' }}>Health Tracker</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Blood Sugar (mg/dL)</label>
            <input
              type="number"
              placeholder="Enter blood sugar"
              value={bloodSugar}
              onChange={e => setBloodSugar(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Weight (lbs)</label>
            <input
              type="number"
              placeholder="Enter weight"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px 0', borderRadius: 6, background: '#3498db', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16, cursor: 'pointer' }}>Submit</button>
        </form>
        {message && <p style={{ marginTop: 18, textAlign: 'center', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      </div>
    </div>
  )
}