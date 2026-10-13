import { useState, type FormEvent } from 'react'
import { CheckCheck, Pencil, Plus, Trash2, Undo2 } from 'lucide-react'
import type { PackingList } from '../types'
import { getListProgress } from '../utils/packingUtils'
import ProgressBar from './ProgressBar'
import PackingItem from './PackingItem'
import EditableText from './EditableText'

interface PackingListCardProps {
    list: PackingList
    onRename: (name: string) => void
    onDelete: () => void
    onAddItem: (name: string) => void
    onToggleItem: (itemId: string) => void
    onRenameItem: (itemId: string, name: string) => void
    onDeleteItem: (itemId: string) => void
    onSetAllPacked: (isPacked: boolean) => void
}

export default function PackingListCard({
    list,
    onRename,
    onDelete,
    onAddItem,
    onToggleItem,
    onRenameItem,
    onDeleteItem,
    onSetAllPacked,
}: PackingListCardProps) {
    const [renaming, setRenaming] = useState(false)
    const [newItem, setNewItem] = useState('')
    const { packed, total, percent } = getListProgress(list)
    const allPacked = total > 0 && packed === total

    const handleAdd = (e: FormEvent) => {
        e.preventDefault()
        if (!newItem.trim()) return
        onAddItem(newItem)
        setNewItem('') // keep focus in the input so you can type the next item
    }

    return (
        <section
            aria-label={list.name}
            className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
        >
            <div className="mb-3 flex items-center gap-2">
                <div className="min-w-0 flex-1">
                    {renaming ? (
                        <EditableText
                            value={list.name}
                            label="List name"
                            className="text-lg font-semibold"
                            onSave={(name) => {
                                onRename(name)
                                setRenaming(false)
                            }}
                            onCancel={() => setRenaming(false)}
                        />
                    ) : (
                        <h3 className="truncate text-lg font-semibold">{list.name}</h3>
                    )}
                </div>
                <span className="shrink-0 text-sm font-medium text-muted">
                    {packed}/{total}
                </span>
                <button
                    type="button"
                    onClick={() => setRenaming(true)}
                    aria-label={`Rename ${list.name}`}
                    className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
                >
                    <Pencil size={16} aria-hidden />
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    aria-label={`Delete ${list.name}`}
                    className="rounded-md p-2 text-muted hover:bg-coral/10 hover:text-coral focus-visible:outline-2 focus-visible:outline-coral"
                >
                    <Trash2 size={16} aria-hidden />
                </button>
            </div>

            <ProgressBar percent={percent} label={`${list.name} progress`} />
            {total > 0 && (
                <button
                    type="button"
                    onClick={() => onSetAllPacked(!allPacked)}
                    className="mt-3 flex items-center gap-1.5 self-start rounded-lg px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary"
                >
                    {allPacked ? <Undo2 size={16} aria-hidden /> : <CheckCheck size={16} aria-hidden />}
                    {allPacked ? 'Uncheck all' : 'Check all'}
                </button>
            )}

            {list.items.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">No items yet. Add your first one below.</p>
            ) : (
                <ul className="mt-3 space-y-0.5">
                    {list.items.map((item) => (
                        <PackingItem
                            key={item.id}
                            item={item}
                            onToggle={() => onToggleItem(item.id)}
                            onRename={(name) => onRenameItem(item.id, name)}
                            onDelete={() => onDeleteItem(item.id)}
                        />
                    ))}
                </ul>
            )}

            <form onSubmit={handleAdd} className="mt-auto flex gap-2 pt-3">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add an item…"
                    aria-label={`Add item to ${list.name}`}
                    maxLength={60}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                    type="submit"
                    disabled={!newItem.trim()}
                    aria-label="Add item"
                    className="rounded-xl bg-primary px-3 text-white disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <Plus size={20} aria-hidden />
                </button>
            </form>
        </section>
    )
}