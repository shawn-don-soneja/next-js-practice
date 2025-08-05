import { redirect } from 'next/navigation'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HealthTrackerPage() {
  const [bloodSugar, setBloodSugar] = useState('')
  const [weight, setWeight] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
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
    <div>
      <h1>Health Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Blood Sugar"
          value={bloodSugar}
          onChange={e => setBloodSugar(e.target.value)}
          style={{ display: 'block', marginBottom: 10 }}
        />
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          style={{ display: 'block', marginBottom: 10 }}
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
