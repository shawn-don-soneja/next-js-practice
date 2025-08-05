import { redirect } from 'next/navigation'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import HealthTrackerForm from './HealthTrackerForm'
import HealthTrackerChart from './HealthTrackerChart'


export default async function HealthTrackerPage() {
  const cookieStore = cookies();
  const headerList = headers();

  const supabase = createServerComponentSupabaseClient({
    cookies: () => cookieStore,
    headers: () => headerList,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/supabase-login');

  // Removed usage of headers and host

  return <>
    <HealthTrackerForm />
    <HealthTrackerChart />
  </>;
}
