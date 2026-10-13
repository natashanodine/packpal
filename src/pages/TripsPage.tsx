import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTrips } from '../hooks/useTrips'
import TripForm from '../components/TripForm'

export default function TripsPage() {
  const { trips, addTrip } = useTrips()
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()

  const handleCreate = (name: string, departureDate: string) => {
    const trip = addTrip(name, departureDate)
    // Take the user straight to the new trip to start adding lists.
    if (trip) navigate(`/trips/${trip.id}`)
  }

  return (
    <main className="mx-auto max-w-5xl p-4">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">PackPal</h1>
          <p className="text-sm text-muted">Your next adventure starts here</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus size={18} aria-hidden />
          New Trip
        </button>
      </header>

      <ul className="mt-4 space-y-2">
        {trips.map((t) => (
          <li key={t.id}>
            <Link to={`/trips/${t.id}`} className="underline">
              {t.name}
            </Link>{' '}
            · {t.departureDate}
          </li>
        ))}
      </ul>

      {showForm && (
        <TripForm
          title="Create a new trip"
          submitLabel="Create Trip"
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </main>
  )
}