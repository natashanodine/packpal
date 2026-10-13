import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, Plus } from 'lucide-react'
import type { Trip } from '../types'
import { useTrips } from '../hooks/useTrips'
import { isPast } from '../utils/dateUtils'
import TripCard from '../components/TripCard'
import TripForm from '../components/TripForm'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

export default function TripsPage() {
  const { trips, addTrip, updateTrip, deleteTrip } = useTrips()
  const navigate = useNavigate()

  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Trip | null>(null)
  const [deleting, setDeleting] = useState<Trip | null>(null)

  // `trips` is already sorted: upcoming soonest-first, then past.
  const upcoming = trips.filter((t) => !isPast(t.departureDate))
  const past = trips.filter((t) => isPast(t.departureDate))

  const handleCreate = (name: string, departureDate: string) => {
    const trip = addTrip(name, departureDate)
    if (trip) navigate(`/trips/${trip.id}`)
  }

  const newTripButton = (label: string) => (
    <button
      type="button"
      onClick={() => setCreating(true)}
      className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Plus size={18} aria-hidden />
      {label}
    </button>
  )

  const grid = (list: Trip[]) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((trip) => (
        <TripCard key={trip.id} trip={trip} onEdit={setEditing} onDelete={setDeleting} />
      ))}
    </div>
  )

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <Plane size={22} aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-bold">PackPal</h1>
            <p className="text-sm text-muted">Your next adventure starts here</p>
          </div>
        </div>
        {trips.length > 0 && newTripButton('New Trip')}
      </header>

      {trips.length === 0 ? (
        <EmptyState
          icon={<Plane size={30} aria-hidden />}
          title="Your next adventure awaits!"
          message="Create a trip, add packing lists, and PackPal will remind you as departure day gets closer."
          action={newTripButton('Create Your First Trip')}
        />
      ) : (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <section aria-labelledby="upcoming-heading">
              <h2 id="upcoming-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
                Upcoming trips
              </h2>
              {grid(upcoming)}
            </section>
          )}
          {past.length > 0 && (
            <section aria-labelledby="past-heading">
              <h2 id="past-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
                Past trips
              </h2>
              {grid(past)}
            </section>
          )}
        </div>
      )}

      {creating && (
        <TripForm
          title="Create a new trip"
          submitLabel="Create Trip"
          onSubmit={handleCreate}
          onClose={() => setCreating(false)}
        />
      )}

      {editing && (
        <TripForm
          title="Edit trip"
          submitLabel="Save Changes"
          initialName={editing.name}
          initialDate={editing.departureDate}
          onSubmit={(name, date) => updateTrip(editing.id, name, date)}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete "${deleting.name}"?`}
          message="This will permanently remove the trip and all its packing lists and items."
          confirmLabel="Delete Trip"
          onConfirm={() => deleteTrip(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </main>
  )
}