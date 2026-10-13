import { Link, useParams } from 'react-router-dom'
import { useTrips } from '../hooks/useTrips'

export default function TripDetailsPage() {
  const { tripId } = useParams()
  const trip = useTrips().getTrip(tripId ?? '')

  if (!trip) {
    return (
      <main className="p-4">
        Trip not found. <Link to="/" className="underline">Back to trips</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl p-4">
      <Link to="/" className="underline">← Back</Link>
      <h1 className="mt-2 text-2xl font-bold">{trip.name}</h1>
      <pre className="mt-4 text-sm">{JSON.stringify(trip.lists, null, 2)}</pre>
    </main>
  )
}