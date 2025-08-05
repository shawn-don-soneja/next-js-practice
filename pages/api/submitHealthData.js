// pages/api/log-health.js (or wherever your handler is)
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const { bloodSugar, weight } = req.body
  if (bloodSugar == null || weight == null) {
    return res.status(400).json({ error: 'Missing data' })
  }

  const { error } = await supabase
    .from('Health Tracker Logs')
    .insert([{
      blood_sugar: bloodSugar,
      weight: weight,
      user_id: session.user.id, // must match RLS
    }])

  if (error) {
    console.log('Insert error:', error)
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ success: true })
}
