// pages/api/log-health.js (or wherever your handler is)
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // Retrieve health data for the authenticated user
  const { data, error } = await supabase
    .from('Health Tracker Logs')
    .select('created_at, blood_sugar, weight')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.log('Fetch error:', error)
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ data })
}
