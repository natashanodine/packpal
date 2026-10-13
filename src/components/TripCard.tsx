import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Eye, ListChecks, Pencil, Trash2 } from 'lucide-react'
import type { Trip } from '../types'
import { countdownLabel, formatDate, isPast } from '../utils/dateUtils'
import { getReminder, getTripProgress } from '../utils/packingUtils'
import ProgressBar from './ProgressBar'
import ReminderBanner from './ReminderBanner'

interface TripCardProps {
  trip: Trip
  onEdit: (trip: Trip) => void
  onDelete: (trip: Trip) => void
}

export default function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  const navigate = useNavigate()
  const { packed, total, percent } = getTripProgress(trip)
  const reminder = getReminder(trip)
  const past = isPast(trip.departureDate)
  const listCount = trip.lists.length

  return (
    <article
      className={`flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md ${past ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">
            <Link to={`/trips/${trip.id}`} className="hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
              {trip.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <Calendar size={14} aria-hidden />
            {formatDate(trip.departureDate)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            past ? 'bg-slate-100 text-muted' : 'bg-primary/10 text-primary'
          }`}
        >
          {countdownLabel(trip.departureDate)}
        </span>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted">
            <ListChecks size={14} aria-hidden />
            {listCount} {listCount === 1 ? 'list' : 'lists'}
          </span>
          <span className="font-medium">
            {packed}/{total} packed
          </span>
        </div>
        <ProgressBar percent={percent} label={`${trip.name} packing progress`} />
      </div>

      {reminder && (
        <ReminderBanner
          compact
          reminder={reminder}
          actionLabel="Open"
          onAction={() => navigate(`/trips/${trip.id}`)}
        />
      )}

      <div className="mt-auto flex gap-2 border-t border-slate-100 pt-4">
        <Link
          to={`/trips/${trip.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Eye size={16} aria-hidden />
          View
        </Link>
        <button
          type="button"
          onClick={() => onEdit(trip)}
          aria-label={`Edit ${trip.name}`}
          className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Pencil size={16} aria-hidden />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(trip)}
          aria-label={`Delete ${trip.name}`}
          className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-coral hover:bg-coral/10 focus-visible:outline-2 focus-visible:outline-coral"
        >
          <Trash2 size={16} aria-hidden />
          Delete
        </button>
      </div>
    </article>
  )
}