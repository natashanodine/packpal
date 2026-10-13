import { Link } from 'react-router-dom'
import { useTrips } from '../hooks/useTrips'

export default function TripsPage() {
  const { trips, loadSampleTrip } = useTrips()
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-bold text-primary">PackPal</h1>
      <button onClick={loadSampleTrip} className="mt-4 rounded-lg bg-primary px-4 py-2 text-white">
        Load sample trip
      </button>
      <ul className="mt-4 space-y-2">
        {trips.map((t) => (
          <li key={t.id}>
            <Link to={`/trips/${t.id}`} className="underline">{t.name}</Link> · {t.departureDate}
          </li>
        ))}
      </ul>
    </main>
  )
}