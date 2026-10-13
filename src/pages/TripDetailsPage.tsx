import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, ListPlus, Pencil, Plus } from 'lucide-react'
import type { PackingList } from '../types'
import { useTrips } from '../hooks/useTrips'
import { countdownLabel, formatDate, isPast } from '../utils/dateUtils'
import { getReminder, getTripProgress } from '../utils/packingUtils'
import ProgressBar from '../components/ProgressBar'
import ReminderBanner from '../components/ReminderBanner'
import PackingListCard from '../components/PackingListCard'
import TripForm from '../components/TripForm'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

export default function TripDetailsPage() {
    const { tripId = '' } = useParams()
    const {
        getTrip,
        updateTrip,
        addList,
        renameList,
        deleteList,
        addItem,
        renameItem,
        toggleItem,
        setAllPacked,
        deleteItem,
    } = useTrips()
    const trip = getTrip(tripId)

    const [editingTrip, setEditingTrip] = useState(false)
    const [deletingList, setDeletingList] = useState<PackingList | null>(null)
    const [newList, setNewList] = useState('')

    if (!trip) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <EmptyState
                    icon={<Calendar size={30} aria-hidden />}
                    title="Trip not found"
                    message="It may have been deleted, or the link is wrong."
                    action={
                        <Link to="/" className="rounded-xl bg-primary px-4 py-3 font-medium text-white">
                            Back to my trips
                        </Link>
                    }
                />
            </main>
        )
    }

    const { packed, total, percent } = getTripProgress(trip)
    const reminder = getReminder(trip)
    const past = isPast(trip.departureDate)

    const handleAddList = (e: FormEvent) => {
        e.preventDefault()
        if (!newList.trim()) return
        addList(trip.id, newList)
        setNewList('')
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
            <Link
                to="/"
                className="mb-6 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
            >
                <ArrowLeft size={16} aria-hidden />
                My trips
            </Link>

            <header className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="break-words text-2xl font-bold sm:text-3xl">{trip.name}</h1>
                        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={16} aria-hidden />
                                {formatDate(trip.departureDate)}
                            </span>
                            <span
                                className={`rounded-full px-3 py-0.5 text-sm font-semibold ${past ? 'bg-slate-100 text-muted' : 'bg-primary/10 text-primary'
                                    }`}
                            >
                                {countdownLabel(trip.departureDate)}
                            </span>
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setEditingTrip(true)}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        <Pencil size={16} aria-hidden />
                        Edit Trip
                    </button>
                </div>

                <div className="mt-6">
                    <div className="mb-2 flex items-baseline justify-between">
                        <span className="text-sm font-medium text-muted">Packing progress</span>
                        <span className="font-semibold">
                            {packed}/{total} items · {percent}%
                        </span>
                    </div>
                    <ProgressBar percent={percent} />
                </div>
            </header>

            {reminder && (
                <div className="mt-4">
                    <ReminderBanner reminder={reminder}/>
                </div>
            )}

            <section id="packing-lists" aria-labelledby="lists-heading" className="mt-8 scroll-mt-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 id="lists-heading" className="text-xl font-semibold">
                        Packing lists
                    </h2>
                    <form onSubmit={handleAddList} className="flex w-full gap-2 sm:w-auto">
                        <input
                            type="text"
                            value={newList}
                            onChange={(e) => setNewList(e.target.value)}
                            placeholder="New list name, e.g. Clothing"
                            aria-label="New list name"
                            maxLength={40}
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-56"
                        />
                        <button
                            type="submit"
                            disabled={!newList.trim()}
                            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <Plus size={16} aria-hidden />
                            Add List
                        </button>
                    </form>
                </div>

                {trip.lists.length === 0 ? (
                    <EmptyState
                        icon={<ListPlus size={30} aria-hidden />}
                        title="No packing lists yet"
                        message="Group your things into lists like Clothing, Toiletries or Electronics. Add your first one above."
                    />
                ) : (
                    <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {trip.lists.map((list) => (
                            <PackingListCard
                                key={list.id}
                                list={list}
                                onRename={(name) => renameList(trip.id, list.id, name)}
                                onDelete={() => setDeletingList(list)}
                                onAddItem={(name) => addItem(trip.id, list.id, name)}
                                onToggleItem={(itemId) => toggleItem(trip.id, list.id, itemId)}
                                onSetAllPacked={(isPacked) => setAllPacked(trip.id, list.id, isPacked)}
                                onRenameItem={(itemId, name) => renameItem(trip.id, list.id, itemId, name)}
                                onDeleteItem={(itemId) => deleteItem(trip.id, list.id, itemId)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {editingTrip && (
                <TripForm
                    title="Edit trip"
                    submitLabel="Save Changes"
                    initialName={trip.name}
                    initialDate={trip.departureDate}
                    onSubmit={(name, date) => updateTrip(trip.id, name, date)}
                    onClose={() => setEditingTrip(false)}
                />
            )}

            {deletingList && (
                <ConfirmDialog
                    title={`Delete "${deletingList.name}"?`}
                    message={`This will remove the list and its ${deletingList.items.length} ${deletingList.items.length === 1 ? 'item' : 'items'
                        }.`}
                    confirmLabel="Delete List"
                    onConfirm={() => deleteList(trip.id, deletingList.id)}
                    onCancel={() => setDeletingList(null)}
                />
            )}
        </main>
    )
}