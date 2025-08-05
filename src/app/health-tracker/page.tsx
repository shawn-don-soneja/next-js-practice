import HealthTrackerChart from './HealthTrackerChart';

export default async function HealthTrackerPage() {
  //const session = await getServerSession(authOptions); // ✅ This works in App Router
  //if (!session) redirect("/login");

  return (
    <div>
        <h1>Health Tracker</h1>
        <input type="number" placeholder="Blood Sugar" />
        <br/>
        <input type="number" placeholder="Weight" />
      {/*}
      {/*<Page />*/}
      {/* Graph */}
      <HealthTrackerChart />
    </div>
  );
}