import { redirect } from 'next/navigation';

// this is in here because my macro-dashboard was initially on /charts, so I want to forward any bookmarked traffic along

export default function Page() {
    redirect('/macro-dashboard');
}