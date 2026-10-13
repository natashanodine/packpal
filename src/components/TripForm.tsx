import { useEffect, useRef, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { todayString } from '../utils/dateUtils'

interface TripFormProps {
  title: string
  submitLabel: string
  initialName?: string
  initialDate?: string
  onSubmit: (name: string, departureDate: string) => void
  onClose: () => void
}

export default function TripForm({
  title,
  submitLabel,
  initialName = '',
  initialDate = '',
  onSubmit,
  onClose,
}: TripFormProps) {
  const [name, setName] = useState(initialName)
  const [date, setDate] = useState(initialDate)
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  // New trips: today or later. Editing: keep an existing past date allowed.
  const today = todayString()
  const minDate = initialDate && initialDate < today ? initialDate : today

  useEffect(() => {
    nameRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Please give your trip a name.')
    if (!date) return setError('Please choose a departure date.')
    if (date < minDate) return setError("Departure date can't be in the past.")
    onSubmit(name.trim(), date)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="trip-form-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="trip-form-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-muted hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="trip-name" className="mb-1 block text-sm font-medium">
              Trip name
            </label>
            <input
              ref={nameRef}
              id="trip-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              placeholder="e.g. Beach Vacation"
              maxLength={60}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="trip-date" className="mb-1 block text-sm font-medium">
              Departure date
            </label>
            <input
              id="trip-date"
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => {
                setDate(e.target.value)
                setError(null)
              }}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-coral">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-medium text-muted hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-3 font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}