import { redirect } from 'next/navigation'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function HealthTrackerPage() {
  const cookieStore = await cookies() // ✅ await cookies()
  
  const supabase = createServerComponentSupabaseClient({
    cookies: () => cookieStore,
    headers: () => ({}),
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/health-tracker-login')

  return (
    <div>
      <h1>Health Tracker</h1>
      <input type="number" placeholder="Blood Sugar" />
      <br />
      <input type="number" placeholder="Weight" />
    </div>
  )
}
